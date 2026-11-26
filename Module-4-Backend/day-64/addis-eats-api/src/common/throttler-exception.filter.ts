import {
  Catch,
  type ExceptionFilter,
  type ArgumentsHost,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import type { Request, Response } from 'express';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter<ThrottlerException> {
  catch(_exception: ThrottlerException, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    if (!response.hasHeader('Retry-After')) {
      response.setHeader('Retry-After', '60');
    }

    response.status(429).json({
      statusCode: 429,
      message: 'Too Many Requests',
      error: 'Too Many Requests',
      requestId: request.requestId ?? 'unknown',
    });
  }
}
