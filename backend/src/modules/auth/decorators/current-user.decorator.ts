import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../types/authenticated-user.type';
export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext): AuthenticatedUser => context.switchToHttp().getRequest().user);
