import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

const config = { get: jest.fn((key: string) => ({ EMAIL_VERIFICATION_EXPIRES_MINUTES: 60, PASSWORD_RESET_EXPIRES_MINUTES: 60, REFRESH_TOKEN_EXPIRES_DAYS: 30 }[key])), getOrThrow: jest.fn((key: string) => ({ FRONTEND_URL: 'http://localhost:3000' }[key])) };
const jwt = { signAsync: jest.fn() };
const email = { sendEmailVerification: jest.fn(), sendPasswordReset: jest.fn() };
describe('AuthService security behavior', () => {
  it('does not disclose an unknown email during password recovery', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue(null) } };
    const service = new AuthService(prisma as never, jwt as never, config as never, email as never);
    await expect(service.forgotPassword({ email: 'missing@example.com' })).resolves.toEqual({ message: 'If an account exists, reset instructions have been sent.' });
  });
  it('rejects a revoked refresh token, preventing reuse after rotation', async () => {
    const prisma = { refreshToken: { findUnique: jest.fn().mockResolvedValue({ revokedAt: new Date(), expiresAt: new Date(Date.now() + 60_000), user: { status: 'ACTIVE', roles: [] } }) } };
    const service = new AuthService(prisma as never, jwt as never, config as never, email as never);
    await expect(service.refresh('already-rotated-token', {})).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('revokes only the supplied active refresh token on logout', async () => {
    const updateMany = jest.fn().mockResolvedValue({ count: 1 });
    const service = new AuthService({ refreshToken: { updateMany } } as never, jwt as never, config as never, email as never);
    await service.logout('refresh-token');
    expect(updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ revokedAt: null }) }));
  });
  it('rejects invalid credentials without revealing whether the email exists', async () => {
    const service = new AuthService({ user: { findUnique: jest.fn().mockResolvedValue(null) } } as never, jwt as never, config as never, email as never);
    await expect(service.login({ email: 'missing@example.com', password: 'Password1' }, {})).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('rejects an expired email verification token', async () => {
    const service = new AuthService({ emailVerificationToken: { findUnique: jest.fn().mockResolvedValue({ usedAt: null, expiresAt: new Date(Date.now() - 1) }) } } as never, jwt as never, config as never, email as never);
    await expect(service.verifyEmail('a'.repeat(48))).rejects.toMatchObject({ response: expect.objectContaining({ code: 'VERIFICATION_TOKEN_EXPIRED' }) });
  });
  it('rejects a password reset token that was already used', async () => {
    const service = new AuthService({ passwordResetToken: { findUnique: jest.fn().mockResolvedValue({ usedAt: new Date(), expiresAt: new Date(Date.now() + 60_000) }) } } as never, jwt as never, config as never, email as never);
    await expect(service.resetPassword({ token: 'a'.repeat(48), newPassword: 'Password1' })).rejects.toMatchObject({ response: expect.objectContaining({ code: 'INVALID_RESET_TOKEN' }) });
  });
});
