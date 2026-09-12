import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { readFileSync } from 'node:fs';
import { Pool } from 'pg';

function createStrictTlsPool(databaseUrl: string, caCertificatePath: string): Pool {
  let connectionUrl: URL;
  try {
    connectionUrl = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }

  if (connectionUrl.protocol !== 'postgresql:' && connectionUrl.protocol !== 'postgres:') {
    throw new Error('DATABASE_URL must use the PostgreSQL protocol.');
  }

  for (const parameter of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey']) {
    connectionUrl.searchParams.delete(parameter);
  }

  let ca: string;
  try {
    ca = readFileSync(caCertificatePath, 'utf8');
  } catch {
    throw new Error('DATABASE_CA_CERT_PATH must reference a readable CA certificate file.');
  }

  return new Pool({
    connectionString: connectionUrl.toString(),
    ssl: { ca, rejectUnauthorized: true },
  });
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly pool: Pool;

  constructor(configService: ConfigService) {
    const pool = createStrictTlsPool(
      configService.getOrThrow<string>('DATABASE_URL'),
      configService.getOrThrow<string>('DATABASE_CA_CERT_PATH'),
    );
    super({ adapter: new PrismaPg(pool) });
    this.pool = pool;
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Database connection established');
    } catch (error) {
      this.logger.error('Database connection failed', error instanceof Error ? error.stack : undefined);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('Database connection closed');
  }
}
