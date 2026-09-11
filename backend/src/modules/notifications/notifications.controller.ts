import { Body, Controller, Get, Patch, Param, Query, Version } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
import { NotificationsService } from './notifications.service';
@Controller()
export class NotificationsController {
 constructor(private readonly notifications: NotificationsService) {}
 @Get('users/me/notification-preferences') @Version('1') preferences(@CurrentUser() user: AuthenticatedUser) { return this.notifications.preferences(user.id); }
 @Patch('users/me/notification-preferences') @Version('1') updatePreferences(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateNotificationPreferencesDto) { return this.notifications.updatePreferences(user.id, dto); }
 @Get('notifications') @Version('1') list(@CurrentUser() user: AuthenticatedUser, @Query() query: NotificationQueryDto) { return this.notifications.list(user.id, query); }
 @Get('notifications/unread-count') @Version('1') unread(@CurrentUser() user: AuthenticatedUser) { return this.notifications.unreadCount(user.id); }
 @Patch('notifications/read-all') @Version('1') readAll(@CurrentUser() user: AuthenticatedUser) { return this.notifications.markAllRead(user.id); }
 @Patch('notifications/:id/read') @Version('1') read(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return this.notifications.markRead(user.id, id); }
}
