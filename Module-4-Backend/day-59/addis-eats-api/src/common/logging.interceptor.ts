import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, finalize, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const startedAt = Date.now();
    let outcome = 'failure';

    return next.handle().pipe(
      tap({
        complete: () => {
          outcome = 'success';
        },
        error: () => {
          outcome = 'failure';
        },
      }),
      finalize(() => {
        this.logger.log(
          `${request.method} ${request.path} ${context.getHandler().name} ${outcome} ${Date.now() - startedAt}ms requestId=${request.requestId ?? 'unknown'}`,
        );
      }),
    );
  }
}
