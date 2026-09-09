import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException ? exception.getResponse() : undefined;
    const message = this.getMessage(exceptionResponse, isHttpException, process.env.NODE_ENV === 'production');

    if (isHttpException) {
      this.logger.warn(`${request.method} ${request.url} ${statusCode}: ${message}`);
    } else {
      this.logger.error(`Unexpected error on ${request.method} ${request.url}`, exception instanceof Error ? exception.stack : undefined);
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      path: request.originalUrl ?? request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getMessage(response: string | object | undefined, isHttpException: boolean, isProduction: boolean): string | string[] {
    if (!isHttpException) return isProduction ? 'Internal server error' : 'Unexpected server error';
    if (typeof response === 'string') return response;
    if (response && 'message' in response) {
      const value = response.message;
      return Array.isArray(value) || typeof value === 'string' ? value : 'Request failed';
    }
    return 'Request failed';
  }
}
