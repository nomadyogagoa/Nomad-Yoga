import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RoleName } from '@prisma/client';
import { AuthenticatedUser } from '../types/authenticated-user.type';
import { PrismaService } from '../../../database/prisma.service';
import { UserStatus } from '@prisma/client';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 constructor(config: ConfigService, private readonly prisma: PrismaService) { super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false, secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET') }); }
 async validate(payload: { sub: string; email: string; roles: RoleName[] }): Promise<AuthenticatedUser> {
   if (!payload.sub || !payload.email || !Array.isArray(payload.roles)) throw new UnauthorizedException();
   const user = await this.prisma.user.findUnique({ where: { id: payload.sub }, include: { roles: { include: { role: true } } } });
   if (!user || user.status === UserStatus.SUSPENDED || user.status === UserStatus.DISABLED) throw new UnauthorizedException();
   return { id: user.id, email: user.email, roles: user.roles.map(({ role }) => role.name) };
 }
}
