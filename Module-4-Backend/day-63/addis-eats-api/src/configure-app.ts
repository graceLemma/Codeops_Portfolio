import { ValidationPipe, type INestApplication } from '@nestjs/common';
import express from 'express';
import helmet from 'helmet';
import { MetricsMiddleware } from './common/metrics.middleware.js';
import { RequestIdMiddleware } from './common/request-id.middleware.js';

const BODY_LIMIT = '100kb';
const DEFAULT_CORS_ORIGINS = ['http://localhost:5173'];

export function getCorsOrigins(configuredOrigins = process.env.CORS_ORIGINS): string[] {
  if (configuredOrigins === undefined) {
    return DEFAULT_CORS_ORIGINS;
  }

  const origins = configuredOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error('CORS_ORIGINS must contain at least one origin');
  }

  return origins;
}

export function configureApp(app: INestApplication): void {
  app.use(helmet());

  const requestIdMiddleware = app.get(RequestIdMiddleware);
  const metricsMiddleware = app.get(MetricsMiddleware);
  app.use(requestIdMiddleware.use.bind(requestIdMiddleware));
  app.use(metricsMiddleware.use.bind(metricsMiddleware));

  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-request-id'],
    exposedHeaders: ['x-request-id', 'Retry-After'],
  });
  app.use(express.json({ limit: BODY_LIMIT }));
  app.use(express.urlencoded({ limit: BODY_LIMIT, extended: true }));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
