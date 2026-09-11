import { Body, Controller, Get, HttpCode, Post, Req, Res, Version } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthenticatedUser } from './types/authenticated-user.type';

@Controller('auth')
export class AuthController {
 constructor(private readonly auth: AuthService) {}
 private meta(request: Request) { return { userAgent: request.get('user-agent'), ipAddress: request.ip, deviceName: request.get('x-device-name') }; }
 private setRefreshCookie(response: Response, token: string): void { response.cookie('refresh_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/v1/auth', maxAge: (Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? 30) * 86_400_000) }); }
 private clearRefreshCookie(response: Response): void { response.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/v1/auth' }); }
 @Public() @Post('register') @Version('1') @Throttle({ default: { limit: 5, ttl: 60_000 } }) register(@Body() dto: RegisterDto) { return this.auth.register(dto); }
 @Public() @Post('verify-email') @Version('1') @Throttle({ default: { limit: 10, ttl: 60_000 } }) verify(@Body() dto: VerifyEmailDto) { return this.auth.verifyEmail(dto.token); }
 @Public() @Post('resend-verification') @Version('1') @Throttle({ default: { limit: 3, ttl: 60_000 } }) resend(@Body() dto: ResendVerificationDto) { return this.auth.resendVerification(dto.email); }
 @Public() @Post('login') @HttpCode(200) @Version('1') @Throttle({ default: { limit: 5, ttl: 60_000 } }) async login(@Body() dto: LoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) { const result = await this.auth.login(dto, this.meta(request)); this.setRefreshCookie(response, result.refreshToken); return { accessToken: result.accessToken }; }
 @Public() @Post('refresh') @HttpCode(200) @Version('1') async refresh(@Body() dto: RefreshTokenDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) { const result = await this.auth.refresh(this.cookie(request, 'refresh_token') ?? dto.refreshToken, this.meta(request)); this.setRefreshCookie(response, result.refreshToken); return { accessToken: result.accessToken }; }
 @Public() @Post('forgot-password') @HttpCode(200) @Version('1') @Throttle({ default: { limit: 3, ttl: 60_000 } }) forgot(@Body() dto: ForgotPasswordDto) { return this.auth.forgotPassword(dto); }
 @Public() @Post('reset-password') @HttpCode(200) @Version('1') @Throttle({ default: { limit: 5, ttl: 60_000 } }) reset(@Body() dto: ResetPasswordDto) { return this.auth.resetPassword(dto); }
 @Post('logout') @HttpCode(200) @Version('1') async logout(@Body() dto: RefreshTokenDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) { const result = await this.auth.logout(this.cookie(request, 'refresh_token') ?? dto.refreshToken); this.clearRefreshCookie(response); return result; }
 @Post('logout-all') @HttpCode(200) @Version('1') logoutAll(@CurrentUser() user: AuthenticatedUser, @Res({ passthrough: true }) response: Response) { this.clearRefreshCookie(response); return this.auth.logoutAll(user.id); }
 private cookie(request: Request, name: string): string | undefined { const prefix = `${name}=`; return request.headers.cookie?.split(';').map((entry) => entry.trim()).find((entry) => entry.startsWith(prefix))?.slice(prefix.length); }
}
