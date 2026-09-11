import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../types/authenticated-user.type';
@Injectable()
export class RolesGuard implements CanActivate {
 constructor(private readonly reflector: Reflector) {}
 canActivate(context: ExecutionContext): boolean {
  const required = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
  if (!required?.length) return true;
  const user = context.switchToHttp().getRequest().user as AuthenticatedUser | undefined;
  if (!user || !required.some((role) => user.roles.includes(role))) throw new ForbiddenException({ code: 'INSUFFICIENT_ROLE', message: 'Insufficient role.' });
  return true;
 }
}
