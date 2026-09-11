import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { pageResult, pagination } from '../../common/pagination/pagination';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
@Injectable()
export class NotificationsService {
 constructor(private readonly prisma: PrismaService) {}
 preferences(userId: string) { return this.prisma.notificationPreference.upsert({ where: { userId }, update: {}, create: { userId } }); }
 updatePreferences(userId: string, dto: UpdateNotificationPreferencesDto) { return this.prisma.notificationPreference.upsert({ where: { userId }, update: dto, create: { userId, ...dto } }); }
 async list(userId: string, query: NotificationQueryDto) { const where = { userId, ...(query.type ? { type: query.type } : {}) }; const [items, total] = await Promise.all([this.prisma.notification.findMany({ where, ...pagination(query), orderBy: { createdAt: query.sortOrder } }), this.prisma.notification.count({ where })]); return pageResult(items, total, query); }
 unreadCount(userId: string) { return this.prisma.notification.count({ where: { userId, readAt: null } }).then((count) => ({ count })); }
 async markRead(userId: string, id: string) { const result = await this.prisma.notification.updateMany({ where: { id, userId, readAt: null }, data: { readAt: new Date() } }); if (!result.count) throw new NotFoundException({ code: 'NOTIFICATION_NOT_FOUND', message: 'Notification not found.' }); return { message: 'Notification marked as read.' }; }
 async markAllRead(userId: string) { const result = await this.prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } }); return { updated: result.count }; }
}
