import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';

export interface HealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  timestamp: string;
  environment: string;
  database: 'connected' | 'unavailable';
}

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async getHealth(): Promise<HealthResponse> {
    try {
      await this.prisma.$queryRawUnsafe('SELECT 1');
      return this.createResponse('ok', 'connected');
    } catch {
      return this.createResponse('degraded', 'unavailable');
    }
  }

  private createResponse(status: HealthResponse['status'], database: HealthResponse['database']): HealthResponse {
    return {
      status,
      service: 'nomad-yoga-api',
      timestamp: new Date().toISOString(),
      environment: this.configService.getOrThrow<string>('NODE_ENV'),
      database,
    };
  }
}
