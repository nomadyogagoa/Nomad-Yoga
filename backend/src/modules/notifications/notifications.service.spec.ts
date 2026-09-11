import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
describe('NotificationsService ownership and preferences', () => {
 it('does not mark a notification outside the current user ownership as read', async () => {
  const service = new NotificationsService({ notification: { updateMany: jest.fn().mockResolvedValue({ count: 0 }) } } as never);
  await expect(service.markRead('owner', 'someone-elses-notification')).rejects.toBeInstanceOf(NotFoundException);
 });
 it('uses an upsert for user notification preferences', async () => {
  const upsert = jest.fn().mockResolvedValue({ userId: 'u1', emailEnabled: false });
  const service = new NotificationsService({ notificationPreference: { upsert } } as never);
  await service.updatePreferences('u1', { emailEnabled: false });
  expect(upsert).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 'u1' }, create: expect.objectContaining({ userId: 'u1' }) }));
 });
});
