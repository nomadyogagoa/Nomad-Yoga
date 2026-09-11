import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { JwtService } from '@nestjs/jwt';
import { Prisma, RoleName, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { EmailService } from '../email/email.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthenticatedUser } from './types/authenticated-user.type';

type RequestMeta = { userAgent?: string; ipAddress?: string; deviceName?: string };
const genericForgotMessage = 'If an account exists, reset instructions have been sent.';
@Injectable()
export class AuthService {
 constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService, private readonly config: ConfigService, private readonly email: EmailService) {}
 private normalizeEmail(email: string): string { return email.trim().toLowerCase(); }
 private hashToken(token: string): string { return createHash('sha256').update(token).digest('hex'); }
 private randomToken(): string { return randomBytes(48).toString('base64url'); }
 private expiresIn(minutes: number): Date { return new Date(Date.now() + minutes * 60_000); }
 private async hashPassword(password: string): Promise<string> { return argon2.hash(password, { type: argon2.argon2id }); }
 private frontendUrl(path: string, token: string): string { return `${this.config.getOrThrow<string>('FRONTEND_URL').replace(/\/$/, '')}${path}?token=${encodeURIComponent(token)}`; }
 async register(dto: RegisterDto): Promise<{ message: string }> {
  const email = this.normalizeEmail(dto.email); const rawToken = this.randomToken();
  try {
   await this.prisma.$transaction(async (tx) => {
    const role = await tx.role.upsert({ where: { name: RoleName.USER }, update: {}, create: { name: RoleName.USER, description: 'Default member role' } });
    const user = await tx.user.create({ data: { email, passwordHash: await this.hashPassword(dto.password), status: UserStatus.ACTIVE, profile: { create: { firstName: dto.firstName.trim(), lastName: dto.lastName.trim() } }, roles: { create: { roleId: role.id } } } });
    await tx.emailVerificationToken.create({ data: { userId: user.id, tokenHash: this.hashToken(rawToken), expiresAt: this.expiresIn(this.config.get<number>('EMAIL_VERIFICATION_EXPIRES_MINUTES') ?? 60) } });
   });
  } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException({ code: 'EMAIL_ALREADY_REGISTERED', message: 'An account with this email already exists.' }); throw error; }
  await this.email.sendEmailVerification(email, this.frontendUrl('/verify-email', rawToken));
  return { message: 'Registration successful. Check your email to verify your account.' };
 }
 async verifyEmail(token: string): Promise<{ message: string }> {
  const tokenHash = this.hashToken(token); const now = new Date();
  const record = await this.prisma.emailVerificationToken.findUnique({ where: { tokenHash } });
  if (!record || record.usedAt) throw new BadRequestException({ code: 'INVALID_VERIFICATION_TOKEN', message: 'Verification token is invalid.' });
  if (record.expiresAt <= now) throw new BadRequestException({ code: 'VERIFICATION_TOKEN_EXPIRED', message: 'Verification token has expired.' });
  await this.prisma.$transaction([this.prisma.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: now } }), this.prisma.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: now } })]);
  const user = await this.prisma.user.findUnique({ where: { id: record.userId }, select: { email: true, profile: { select: { firstName: true } } } });
  if (user) void this.email.sendWelcomeEmail(user.email, user.profile?.firstName).catch(() => undefined);
  return { message: 'Email verified successfully.' };
 }
 async resendVerification(emailInput: string): Promise<{ message: string }> {
  const email = this.normalizeEmail(emailInput); const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user || user.emailVerifiedAt) return { message: 'If an account needs verification, instructions have been sent.' };
  const rawToken = this.randomToken();
  await this.prisma.$transaction([this.prisma.emailVerificationToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } }), this.prisma.emailVerificationToken.create({ data: { userId: user.id, tokenHash: this.hashToken(rawToken), expiresAt: this.expiresIn(this.config.get<number>('EMAIL_VERIFICATION_EXPIRES_MINUTES') ?? 60) } })]);
  await this.email.sendEmailVerification(email, this.frontendUrl('/verify-email', rawToken));
  return { message: 'If an account needs verification, instructions have been sent.' };
 }
 async login(dto: LoginDto, meta: RequestMeta): Promise<{ accessToken: string; refreshToken: string }> {
  const email = this.normalizeEmail(dto.email); const user = await this.prisma.user.findUnique({ where: { email }, include: { roles: { include: { role: true } } } });
  if (!user || !user.passwordHash || !(await argon2.verify(user.passwordHash, dto.password))) throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' });
  if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.DISABLED) throw new ForbiddenException({ code: 'ACCOUNT_SUSPENDED', message: 'This account is unavailable.' });
  if (!user.emailVerifiedAt) throw new ForbiddenException({ code: 'EMAIL_NOT_VERIFIED', message: 'Verify your email before logging in.' });
  await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return this.issueTokens({ id: user.id, email: user.email, roles: user.roles.map(({ role }) => role.name) }, meta);
 }
 async refresh(rawToken: string | undefined, meta: RequestMeta): Promise<{ accessToken: string; refreshToken: string }> {
  if (!rawToken) throw new UnauthorizedException({ code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is invalid.' });
  const record = await this.prisma.refreshToken.findUnique({ where: { tokenHash: this.hashToken(rawToken) }, include: { user: { include: { roles: { include: { role: true } } } } } });
  if (!record || record.revokedAt || record.expiresAt <= new Date() || record.user.status === UserStatus.SUSPENDED || record.user.status === UserStatus.DISABLED) throw new UnauthorizedException({ code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is invalid.' });
  const user: AuthenticatedUser = { id: record.user.id, email: record.user.email, roles: record.user.roles.map(({ role }) => role.name) };
  const newRawToken = this.randomToken();
  const accessToken = await this.createAccessToken(user);
  await this.prisma.$transaction([this.prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } }), this.prisma.refreshToken.create({ data: this.refreshData(user.id, newRawToken, meta) })]);
  return { accessToken, refreshToken: newRawToken };
 }
 async logout(rawToken: string | undefined): Promise<{ message: string }> { if (rawToken) await this.prisma.refreshToken.updateMany({ where: { tokenHash: this.hashToken(rawToken), revokedAt: null }, data: { revokedAt: new Date() } }); return { message: 'Logged out successfully.' }; }
 async logoutAll(userId: string): Promise<{ message: string }> { await this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } }); return { message: 'Logged out of all devices successfully.' }; }
 async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> { const user = await this.prisma.user.findUnique({ where: { email: this.normalizeEmail(dto.email) } }); if (!user) return { message: genericForgotMessage }; const rawToken = this.randomToken(); await this.prisma.$transaction([this.prisma.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } }), this.prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: this.hashToken(rawToken), expiresAt: this.expiresIn(this.config.get<number>('PASSWORD_RESET_EXPIRES_MINUTES') ?? 60) } })]); await this.email.sendPasswordReset(user.email, this.frontendUrl('/reset-password', rawToken)); return { message: genericForgotMessage }; }
 async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> { const token = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash: this.hashToken(dto.token) } }); if (!token || token.usedAt) throw new BadRequestException({ code: 'INVALID_RESET_TOKEN', message: 'Reset token is invalid.' }); if (token.expiresAt <= new Date()) throw new BadRequestException({ code: 'RESET_TOKEN_EXPIRED', message: 'Reset token has expired.' }); const now = new Date(); await this.prisma.$transaction([this.prisma.user.update({ where: { id: token.userId }, data: { passwordHash: await this.hashPassword(dto.newPassword) } }), this.prisma.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: now } }), this.prisma.refreshToken.updateMany({ where: { userId: token.userId, revokedAt: null }, data: { revokedAt: now } })]); return { message: 'Password reset successfully. Please log in again.' }; }
 private async issueTokens(user: AuthenticatedUser, meta: RequestMeta): Promise<{ accessToken: string; refreshToken: string }> { const refreshToken = this.randomToken(); const accessToken = await this.createAccessToken(user); await this.prisma.refreshToken.create({ data: this.refreshData(user.id, refreshToken, meta) }); return { accessToken, refreshToken }; }
 private async createAccessToken(user: AuthenticatedUser): Promise<string> { return this.jwt.signAsync({ sub: user.id, email: user.email, roles: user.roles }); }
 private refreshData(userId: string, rawToken: string, meta: RequestMeta) { return { userId, tokenHash: this.hashToken(rawToken), expiresAt: this.expiresIn((this.config.get<number>('REFRESH_TOKEN_EXPIRES_DAYS') ?? 30) * 24 * 60), deviceName: meta.deviceName, userAgent: meta.userAgent, ipAddress: meta.ipAddress }; }
}
