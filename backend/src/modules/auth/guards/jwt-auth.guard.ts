import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) { super(); }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // Public routes remain usable anonymously, but attach an authenticated user
    // when a bearer token is supplied (needed for guest/authenticated cart routes).
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]) && !context.switchToHttp().getRequest().headers?.authorization) return true;
    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
