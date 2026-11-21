import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { MetricsMiddleware } from '../src/common/metrics.middleware.js';
import { RequestIdMiddleware } from '../src/common/request-id.middleware.js';
import { setupSwagger } from '../src/swagger.js';

describe('Day 60 API (e2e)', () => {
  let app: INestApplication<App>;
  const previousApiKey = process.env.API_KEY;
  const previousLogLevel = process.env.LOG_LEVEL;
  const previousNodeEnv = process.env.NODE_ENV;
  let openApiDocument: ReturnType<typeof setupSwagger>;

  beforeAll(async () => {
    process.env.API_KEY = 'test-api-key';
    process.env.LOG_LEVEL = 'verbose';
    process.env.NODE_ENV = 'test';
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    const requestIdMiddleware = app.get(RequestIdMiddleware);
    const metricsMiddleware = app.get(MetricsMiddleware);
    app.use(requestIdMiddleware.use.bind(requestIdMiddleware));
    app.use(metricsMiddleware.use.bind(metricsMiddleware));
    openApiDocument = setupSwagger(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    if (previousApiKey === undefined) {
      delete process.env.API_KEY;
    } else {
      process.env.API_KEY = previousApiKey;
    }
    if (previousLogLevel === undefined) {
      delete process.env.LOG_LEVEL;
    } else {
      process.env.LOG_LEVEL = previousLogLevel;
    }
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('documents all nine existing endpoints and serves Swagger at /docs', async () => {
    const orders = openApiDocument.paths['/api/orders'];
    const restaurants = openApiDocument.paths['/api/restaurants'];
    const summaries = [
      openApiDocument.paths['/api']?.get?.summary,
      openApiDocument.paths['/api/metrics']?.get?.summary,
      orders?.get?.summary,
      orders?.post?.summary,
      openApiDocument.paths['/api/orders/delayed']?.get?.summary,
      openApiDocument.paths['/api/orders/{id}']?.get?.summary,
      restaurants?.get?.summary,
      restaurants?.post?.summary,
      openApiDocument.paths['/api/restaurants/{id}']?.get?.summary,
    ];

    expect(summaries).toHaveLength(9);
    expect(summaries.every(Boolean)).toBe(true);
    expect(openApiDocument.components?.securitySchemes?.['api-key']).toBeTruthy();
    expect(orders?.get?.responses['401']).toBeTruthy();
    expect(orders?.get?.responses['403']).toBeTruthy();
    expect(orders?.get?.responses['408']).toBeTruthy();
    expect(orders?.post?.responses['400']).toBeTruthy();
    expect(restaurants?.get?.responses['400']).toBeTruthy();
    expect(restaurants?.post?.responses['403']).toBeTruthy();
    expect(openApiDocument.paths['/api/restaurants/{id}']?.get?.responses['404']).toBeTruthy();
    await request(app.getHttpServer()).get('/docs/').expect(200);
  });

  it('requires an API key and distinguishes missing from invalid keys', async () => {
    await request(app.getHttpServer()).get('/api').expect(401);
    await request(app.getHttpServer())
      .get('/api')
      .set('x-api-key', 'wrong-key')
      .expect(403);
  });

  it('uses the global roles guard for admin-only operations', async () => {
    await request(app.getHttpServer())
      .post('/api/restaurants')
      .set('x-api-key', 'test-api-key')
      .send({ name: 'New Restaurant', area: 'Bole' })
      .expect(403);
  });

  it('honours and generates request IDs for API responses', async () => {
    const suppliedId = await request(app.getHttpServer())
      .get('/api')
      .set('x-api-key', 'test-api-key')
      .set('x-request-id', 'day-59-request')
      .expect(200);
    expect(suppliedId.headers['x-request-id']).toBe('day-59-request');
    expect(suppliedId.text).toBe('Hello World!');

    const generatedId = await request(app.getHttpServer())
      .get('/api')
      .set('x-api-key', 'test-api-key')
      .expect(200);
    expect(generatedId.headers['x-request-id']).toMatch(
      /^[0-9a-f]{8}-[0-9a-f-]{27}$/i,
    );
  });

  it('parses area case-insensitively and rejects unsupported areas', async () => {
    for (const area of ['bole', 'BOLE']) {
      const response = await request(app.getHttpServer())
        .get(`/api/restaurants?area=${area}`)
        .set('x-api-key', 'test-api-key')
        .expect(200);
      expect(response.body).toEqual([
        { id: 1, name: 'Yod Abyssinia', area: 'Bole', isOpen: true },
      ]);
    }

    await request(app.getHttpServer())
      .get('/api/restaurants?area=adama')
      .set('x-api-key', 'test-api-key')
      .expect(400);
  });

  it('counts endpoint requests and exposes the Map at /api/metrics', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .set('x-api-key', 'test-api-key')
      .expect(200);
    expect(response.body['GET /api']).toBeGreaterThan(0);
    expect(response.body['GET /api/restaurants']).toBe(3);
    expect(response.body['GET /api/metrics']).toBe(1);
  });

  it('allows the demo owner to read their order', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/orders')
      .set('x-api-key', 'test-api-key')
      .send({ customer: 'Demo User', area: 'Bole', totalSantim: 1200 })
      .expect(201);
    expect(created.body.ownerId).toBe('user-1');

    const found = await request(app.getHttpServer())
      .get(`/api/orders/${created.body.id}`)
      .set('x-api-key', 'test-api-key')
      .expect(200);
    expect(found.body.id).toBe(created.body.id);
  });

  it('redacts authorization, x-api-key, and phone in logs and carries request IDs into service logs', async () => {
    const output = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    let loggedLines: string[] = [];
    try {
      await request(app.getHttpServer())
        .post('/api/orders')
        .set('authorization', 'Bearer auth-secret')
        .set('x-api-key', 'test-api-key')
        .set('x-request-id', 'redaction-request-id')
        .send({
          customer: 'Redaction Test',
          area: 'Bole',
          totalSantim: 990,
          phone: '0912345678',
        })
        .expect(201);
    } finally {
      loggedLines = output.mock.calls.map(([line]) => String(line));
      output.mockRestore();
    }

    const logged = loggedLines.join('\n');
    expect(logged).toContain('[REDACTED]');
    expect(logged).toContain('order.created');
    expect(logged).toContain('redaction-request-id');
    expect(logged).not.toContain('auth-secret');
    expect(logged).not.toContain('test-api-key');
    expect(logged).not.toContain('0912345678');
  });

  it('answers 408 when the deliberate service delay exceeds five seconds', async () => {
    await request(app.getHttpServer())
      .get('/api/orders/delayed')
      .set('x-api-key', 'test-api-key')
      .timeout({ response: 6000, deadline: 7000 })
      .expect(408);
  });
});
