import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

const userSelect = { id: true, email: true, emailVerifiedAt: true, status: true, lastLoginAt: true, createdAt: true, roles: { select: { role: { select: { name: true } } } }, profile: { select: { firstName: true, lastName: true, phone: true, countryCode: true, city: true, dateOfBirth: true, avatarUrl: true, bio: true } } } as const;
@Injectable()
export class UsersService {
 constructor(private readonly prisma: PrismaService) {}
 async findMe(id: string) {
   const user = await this.prisma.user.findUnique({ where: { id }, select: userSelect });
   if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found.' });
   return { ...user, roles: user.roles.map(({ role }) => role.name) };
 }
 async updateMe(id: string, dto: UpdateProfileDto) {
   const data = Object.fromEntries(Object.entries(dto).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]));
   if (data.dateOfBirth) data.dateOfBirth = new Date(data.dateOfBirth as string);
   await this.prisma.userProfile.update({ where: { userId: id }, data });
   return this.findMe(id);
 }
}
