import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { RequestContext } from './common/request-context.js';
import { MetricsMiddleware } from './common/metrics.middleware.js';
import { RequestIdMiddleware } from './common/request-id.middleware.js';
import { StructuredLogger } from './common/structured-logger.js';
import { setupSwagger } from './swagger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
    logger: new StructuredLogger(new RequestContext()),
  });

  app.useLogger(app.get(StructuredLogger));
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

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();