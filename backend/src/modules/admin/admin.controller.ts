import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Version } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { AdminService } from './admin.service';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
import { AdminUsersQueryDto } from './dto/admin-users-query.dto';
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto';
import { UpdateSettingDto } from './dto/setting.dto';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
@Controller('admin') @Roles(RoleName.ADMIN)
export class AdminController {
 constructor(private readonly admin: AdminService) {}
 @Get('users') @Version('1') users(@Query() query: AdminUsersQueryDto) { return this.admin.users(query); }
 @Get('users/:id') @Version('1') user(@Param('id') id: string) { return this.admin.user(id); }
 @Patch('users/:id/status') @Version('1') status(@CurrentUser() actor: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateUserStatusDto) { return this.admin.updateStatus(actor.id, id, dto); }
 @Patch('users/:id/roles') @Version('1') roles(@CurrentUser() actor: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateUserRolesDto) { return this.admin.updateRoles(actor.id, id, dto); }
 @Get('dashboard/summary') @Version('1') summary() { return this.admin.summary(); }
 @Get('audit-logs') @Version('1') audit(@Query() query: AuditLogQueryDto) { return this.admin.auditLogs(query); }
 @Get('media') @Version('1') mediaList(@Query() query: AdminUsersQueryDto) { return this.admin.mediaList(query); }
 @Get('media/:id') @Version('1') media(@Param('id') id: string) { return this.admin.media(id); }
 @Post('media') @Version('1') createMedia(@CurrentUser() actor: AuthenticatedUser, @Body() dto: CreateMediaDto) { return this.admin.createMedia(actor.id, dto); }
 @Patch('media/:id') @Version('1') updateMedia(@CurrentUser() actor: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateMediaDto) { return this.admin.updateMedia(actor.id, id, dto); }
 @Delete('media/:id') @Version('1') deleteMedia(@CurrentUser() actor: AuthenticatedUser, @Param('id') id: string) { return this.admin.deleteMedia(actor.id, id); }
 @Get('settings') @Version('1') settings() { return this.admin.settings(); }
 @Get('settings/:key') @Version('1') setting(@Param('key') key: string) { return this.admin.setting(key); }
 @Put('settings/:key') @Version('1') updateSetting(@CurrentUser() actor: AuthenticatedUser, @Param('key') key: string, @Body() dto: UpdateSettingDto) { return this.admin.updateSetting(actor.id, key, dto); }
}
