import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { randomUUID } from 'crypto';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
  // rawBody is retained only for verified gateway webhooks; JSON handling is unchanged.
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.enableShutdownHooks();
  if (config.getOrThrow<string>('NODE_ENV') === 'production') app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.use(helmet());
  const configuredOrigins = config.get<string>('FRONTEND_URLS');
  const allowedOrigins = (configuredOrigins || config.getOrThrow<string>('FRONTEND_URL')).split(',').map((origin) => origin.trim()).filter(Boolean);
  app.enableCors({ origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => callback(null, !origin || allowedOrigins.includes(origin)), credentials: true });
  app.use((request: any, response: any, next: () => void) => { const incoming = request.header?.('x-request-id'); const requestId = typeof incoming === 'string' && /^[A-Za-z0-9_-]{8,128}$/.test(incoming) ? incoming : randomUUID(); request.requestId = requestId; response.setHeader('X-Request-Id', requestId); next(); });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = config.getOrThrow<number>('PORT');
  const environment = config.getOrThrow<string>('NODE_ENV');
  await app.listen(port);
  logger.log(`Nomad Yoga API listening on port ${port} (${environment})`);
}

void bootstrap();
