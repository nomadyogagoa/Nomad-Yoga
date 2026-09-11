import { ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
describe('RolesGuard', () => {
 const context = (roles?: string[]) => ({ getHandler: () => ({}), getClass: () => ({}), switchToHttp: () => ({ getRequest: () => ({ user: roles ? { roles } : undefined }) }) });
 it('allows an authenticated user with the requested role', () => { const guard = new RolesGuard({ getAllAndOverride: () => ['ADMIN'] } as never); expect(guard.canActivate(context(['ADMIN']) as never)).toBe(true); });
 it('rejects missing required roles', () => { const guard = new RolesGuard({ getAllAndOverride: () => ['ADMIN'] } as never); expect(() => guard.canActivate(context(['USER']) as never)).toThrow(ForbiddenException); });
});
