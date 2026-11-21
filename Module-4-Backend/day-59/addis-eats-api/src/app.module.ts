import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ApiKeyGuard } from './common/api-key.guard.js';
import { LoggingInterceptor } from './common/logging.interceptor.js';
import { MetricsController } from './common/metrics.controller.js';
import { MetricsMiddleware } from './common/metrics.middleware.js';
import { MetricsService } from './common/metrics.service.js';
import { RequestIdMiddleware } from './common/request-id.middleware.js';
import { RolesGuard } from './common/roles.guard.js';
import { TimeoutInterceptor } from './common/timeout.interceptor.js';
import { OrdersModule } from './orders/order.module.js';
import { RestaurantsModule } from './restaurants/restaurants.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'addis-eats-api',
    }),
    OrdersModule,
    RestaurantsModule,
  ],
  controllers: [AppController, MetricsController],
  providers: [
    AppService,
    MetricsService,
    MetricsMiddleware,
    RequestIdMiddleware,
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
  ],
})
export class AppModule {}
