import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, finalize, tap } from 'rxjs';
import { StructuredLogger } from './structured-logger.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: StructuredLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const startedAt = Date.now();
    let outcome = 'failure';
    let errorName: string | undefined;

    return next.handle().pipe(
      tap({
        complete: () => {
          outcome = 'success';
        },
        error: (error: unknown) => {
          outcome = 'failure';
          errorName = error instanceof Error ? error.name : 'UnknownError';
        },
      }),
      finalize(() => {
        this.logger.log(
          {
            method: request.method,
            path: request.path,
            handlerName: context.getHandler().name,
            outcome,
            durationMs: Date.now() - startedAt,
            requestId: request.requestId ?? 'unknown',
            headers: {
              authorization: request.headers.authorization,
              'x-api-key': request.headers['x-api-key'],
            },
            body: request.body,
            ...(errorName ? { errorName } : {}),
          },
          LoggingInterceptor.name,
        );
      }),
    );
  }
}
