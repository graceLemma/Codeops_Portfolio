import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError, catchError, throwError, timeout } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      timeout({ first: 5000 }),
      catchError((error: unknown) =>
        error instanceof TimeoutError
          ? throwError(() => new RequestTimeoutException('Request timed out'))
          : throwError(() => error),
      ),
    );
  }
}
