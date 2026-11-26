import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { RequestContext } from './common/request-context.js';
import { StructuredLogger } from './common/structured-logger.js';
import { setupSwagger } from './swagger.js';
import { configureApp } from './configure-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
    logger: new StructuredLogger(new RequestContext()),
    bodyParser: false,
  });

  app.useLogger(app.get(StructuredLogger));
  configureApp(app);
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();