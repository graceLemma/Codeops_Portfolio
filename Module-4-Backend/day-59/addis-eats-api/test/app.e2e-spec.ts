import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { MetricsMiddleware } from '../src/common/metrics.middleware.js';
import { RequestIdMiddleware } from '../src/common/request-id.middleware.js';

describe('Day 59 API (e2e)', () => {
  let app: INestApplication<App>;
  const previousApiKey = process.env.API_KEY;

  beforeAll(async () => {
    process.env.API_KEY = 'test-api-key';
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
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    if (previousApiKey === undefined) {
      delete process.env.API_KEY;
    } else {
      process.env.API_KEY = previousApiKey;
    }
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

  it('answers 408 when the deliberate service delay exceeds five seconds', async () => {
    await request(app.getHttpServer())
      .get('/api/orders/delayed')
      .set('x-api-key', 'test-api-key')
      .timeout({ response: 6000, deadline: 7000 })
      .expect(408);
  });
});
