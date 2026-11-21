import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { MetricsMiddleware } from './common/metrics.middleware.js';
import { RequestIdMiddleware } from './common/request-id.middleware.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  const requestIdMiddleware = app.get(RequestIdMiddleware);
  const metricsMiddleware = app.get(MetricsMiddleware);
  app.use(requestIdMiddleware.use.bind(requestIdMiddleware));
  app.use(metricsMiddleware.use.bind(metricsMiddleware));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();