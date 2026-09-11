import { BadRequestException } from '@nestjs/common';
import { RoleName, UserStatus } from '@prisma/client';
import { AdminService } from './admin.service';
const audit = { record: jest.fn() };
describe('AdminService account safeguards', () => {
 it('blocks an administrator from removing their own ADMIN role', async () => {
  const tx = { user: { findUnique: jest.fn().mockResolvedValue({ roles: [{ role: { name: RoleName.ADMIN } }] }) } };
  const service = new AdminService({ $transaction: (fn: (client: typeof tx) => unknown) => fn(tx) } as never, audit as never);
  await expect(service.updateRoles('u1', 'u1', { roles: [RoleName.USER] })).rejects.toMatchObject({ response: expect.objectContaining({ code: 'SELF_ADMIN_ROLE_REMOVAL_BLOCKED' }) });
 });
 it('protects the last ADMIN account from role removal', async () => {
  const tx = { user: { findUnique: jest.fn().mockResolvedValue({ roles: [{ role: { name: RoleName.ADMIN } }] }) }, userRole: { count: jest.fn().mockResolvedValue(1) } };
  const service = new AdminService({ $transaction: (fn: (client: typeof tx) => unknown) => fn(tx) } as never, audit as never);
  await expect(service.updateRoles('actor', 'target', { roles: [RoleName.USER] })).rejects.toMatchObject({ response: expect.objectContaining({ code: 'LAST_ADMIN_PROTECTED' }) });
 });
 it('changes an allowed status and writes an audit event', async () => {
  const update = jest.fn(); const tx = { user: { findUnique: jest.fn().mockResolvedValue({ status: UserStatus.ACTIVE }), update }, };
  const prisma = { $transaction: (fn: (client: typeof tx) => unknown) => fn(tx), user: { findUnique: jest.fn().mockResolvedValue({ id: 'u1', roles: [] }) } };
  const service = new AdminService(prisma as never, audit as never);
  await service.updateStatus('admin', 'u1', { status: UserStatus.SUSPENDED });
  expect(audit.record).toHaveBeenCalledWith(expect.objectContaining({ action: 'USER_STATUS_CHANGED', actorId: 'admin' }), tx);
 });
 it('returns only explicitly allowlisted public settings', async () => {
  const findMany = jest.fn().mockResolvedValue([]);
  const service = new AdminService({ siteSetting: { findMany } } as never, audit as never);
  await service.publicSettings();
  expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { key: { in: ['site.identity', 'contact.info', 'pwa.config', 'feature.public'] } } }));
 });
});
