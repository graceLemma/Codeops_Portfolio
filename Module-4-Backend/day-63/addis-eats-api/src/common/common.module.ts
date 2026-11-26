import { Global, Module } from '@nestjs/common';
import { MetricsMiddleware } from './metrics.middleware.js';
import { MetricsService } from './metrics.service.js';
import { RequestContext } from './request-context.js';
import { RequestIdMiddleware } from './request-id.middleware.js';
import { StructuredLogger } from './structured-logger.js';

@Global()
@Module({
  providers: [
    MetricsService,
    MetricsMiddleware,
    RequestContext,
    RequestIdMiddleware,
    StructuredLogger,
  ],
  exports: [
    MetricsService,
    MetricsMiddleware,
    RequestContext,
    RequestIdMiddleware,
    StructuredLogger,
  ],
})
export class CommonModule {}
