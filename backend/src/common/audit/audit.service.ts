import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
type AuditClient = Pick<PrismaClient, 'auditLog'>;
@Injectable()
export class AuditService {
 constructor(private readonly prisma: PrismaService) {}
 async record(input: { actorId?: string; action: string; entityType: string; entityId?: string; oldValues?: Prisma.InputJsonValue; newValues?: Prisma.InputJsonValue }, client: AuditClient = this.prisma): Promise<void> {
  await client.auditLog.create({ data: { actorId: input.actorId, action: input.action, entityType: input.entityType, entityId: input.entityId, metadata: { oldValues: input.oldValues ?? null, newValues: input.newValues ?? null } } });
 }
}
