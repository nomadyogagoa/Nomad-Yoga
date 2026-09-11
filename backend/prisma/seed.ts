import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await Promise.all([
    prisma.role.upsert({ where: { name: RoleName.USER }, update: {}, create: { name: RoleName.USER, description: 'Default member role' } }),
    prisma.role.upsert({ where: { name: RoleName.ADMIN }, update: {}, create: { name: RoleName.ADMIN, description: 'Administrative role' } }),
  ]);
}

main().then(() => prisma.$disconnect()).catch(async (error: unknown) => { await prisma.$disconnect(); throw error; });
