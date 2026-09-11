import { ArgumentsHost, BadRequestException, Catch, ConflictException, ExceptionFilter, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

type RequestWithId = Request & { requestId?: string };

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<RequestWithId>();
    const mapped = this.mapPrismaError(exception);
    const safeException = mapped ?? exception;
    const isHttpException = safeException instanceof HttpException;
    const statusCode = isHttpException ? safeException.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException ? safeException.getResponse() : undefined;
    const message = this.getMessage(exceptionResponse, isHttpException, process.env.NODE_ENV === 'production');
    const code = this.getCode(exceptionResponse);
    const requestId = request.requestId;

    if (isHttpException) {
      this.logger.warn(`${request.method} ${request.url} ${statusCode}${requestId ? ` requestId=${requestId}` : ''}: ${message}`);
    } else {
      this.logger.error(`Unexpected error on ${request.method} ${request.url}${requestId ? ` requestId=${requestId}` : ''}`, exception instanceof Error ? exception.stack : undefined);
    }

    response.status(statusCode).json({ success: false, statusCode, message, ...(code ? { code } : {}), path: request.originalUrl ?? request.url, timestamp: new Date().toISOString(), ...(requestId ? { requestId } : {}) });
  }

  private mapPrismaError(exception: unknown): HttpException | undefined {
    if (!(exception instanceof Prisma.PrismaClientKnownRequestError)) return undefined;
    if (exception.code === 'P2002') return new ConflictException({ code: 'RESOURCE_CONFLICT', message: 'A record with this value already exists.' });
    if (exception.code === 'P2003') return new BadRequestException({ code: 'RELATION_CONSTRAINT_VIOLATION', message: 'This change is blocked by related data.' });
    if (exception.code === 'P2025') return new NotFoundException({ code: 'RECORD_NOT_FOUND', message: 'The requested record was not found.' });
    return new BadRequestException({ code: 'DATABASE_CONSTRAINT_VIOLATION', message: 'The requested change violates a data constraint.' });
  }

  private getCode(response: string | object | undefined): string | undefined {
    if (response && typeof response === 'object' && 'code' in response && typeof response.code === 'string') return response.code;
    return undefined;
  }

  private getMessage(response: string | object | undefined, isHttpException: boolean, isProduction: boolean): string | string[] {
    if (!isHttpException) return isProduction ? 'Internal server error' : 'Unexpected server error';
    if (typeof response === 'string') return response;
    if (response && 'message' in response) { const value = response.message; return Array.isArray(value) || typeof value === 'string' ? value : 'Request failed'; }
    return 'Request failed';
  }
}
