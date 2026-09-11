import { Controller, Get, HttpStatus, Res, Version } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../modules/auth/decorators/public.decorator';
import { HealthResponse, HealthService } from './health.service';

@Controller('health')
@Public()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Version('1')
  async getHealth(@Res({ passthrough: true }) response: Response): Promise<HealthResponse> {
    const health = await this.healthService.getHealth();
    if (health.status === 'degraded') response.status(HttpStatus.SERVICE_UNAVAILABLE);
    return health;
  }
}
