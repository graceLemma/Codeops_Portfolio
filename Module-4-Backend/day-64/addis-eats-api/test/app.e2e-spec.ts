import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/configure-app.js';
import { setupSwagger } from '../src/swagger.js';

describe('Day 63 API security (e2e)', () => {
  let app: INestApplication<App>;
  const previousApiKey = process.env.API_KEY;
  const previousLogLevel = process.env.LOG_LEVEL;
  const previousNodeEnv = process.env.NODE_ENV;
  const previousCorsOrigins = process.env.CORS_ORIGINS;
  let openApiDocument: ReturnType<typeof setupSwagger>;

  beforeAll(async () => {
    process.env.API_KEY = 'test-api-key';
    process.env.LOG_LEVEL = 'verbose';
    process.env.NODE_ENV = 'test';
    process.env.CORS_ORIGINS = 'http://localhost:5173';
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication({ bodyParser: false });
    configureApp(app);
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
    if (previousCorsOrigins === undefined) {
      delete process.env.CORS_ORIGINS;
    } else {
      process.env.CORS_ORIGINS = previousCorsOrigins;
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

  it('sets Helmet headers on successful and error responses', async () => {
    const success = await request(app.getHttpServer())
      .get('/api')
      .set('x-api-key', 'test-api-key')
      .expect(200);
    expect(success.headers['strict-transport-security']).toContain('max-age=');
    expect(success.headers['x-powered-by']).toBeUndefined();

    const notFound = await request(app.getHttpServer())
      .get('/api/not-a-route')
      .set('x-api-key', 'test-api-key')
      .expect(404);
    expect(notFound.headers['strict-transport-security']).toContain('max-age=');
    expect(notFound.headers['x-powered-by']).toBeUndefined();
  });

  it('allows only configured CORS origins and enables credentialed methods', async () => {
    const allowed = await request(app.getHttpServer())
      .options('/api')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET')
      .set('Access-Control-Request-Headers', 'x-api-key')
      .expect(204);
    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(allowed.headers['access-control-allow-credentials']).toBe('true');
    expect(allowed.headers['access-control-allow-methods']).toContain('POST');

    const denied = await request(app.getHttpServer())
      .get('/api')
      .set('Origin', 'https://unlisted.example')
      .set('x-api-key', 'test-api-key')
      .expect(200);
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('rejects mass assignment and object-valued injection fields on writes', async () => {
    await request(app.getHttpServer())
      .post('/api/orders')
      .set('x-api-key', 'test-api-key')
      .send({
        customer: 'Unexpected Owner',
        area: 'Bole',
        totalSantim: 1200,
        ownerId: 'user-2',
        status: 'Delivered',
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/api/orders')
      .set('x-api-key', 'test-api-key')
      .send({
        customer: { $ne: '' },
        area: 'Bole',
        totalSantim: 1200,
      })
      .expect(400);
  });

  it('rejects request bodies larger than 100 KB', async () => {
    const oversizedBody = JSON.stringify({ padding: 'x'.repeat(110_000) });
    await request(app.getHttpServer())
      .post('/api/orders')
      .set('x-api-key', 'test-api-key')
      .set('Content-Type', 'application/json')
      .send(oversizedBody)
      .expect(413);
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

  it('throttles at 300 requests per minute and returns the Day 58 error shape', async () => {
    const responses = await Promise.all(
      Array.from({ length: 301 }, (_, index) =>
        request(app.getHttpServer())
          .get('/api/metrics')
          .set('x-api-key', 'test-api-key')
          .set('x-request-id', `throttle-${index}`),
      ),
    );
    const limited = responses.find((response) => response.status === 429);

    expect(limited).toBeDefined();
    expect(Number(limited?.headers['retry-after'])).toBeGreaterThan(0);
    expect(limited?.body).toMatchObject({
      statusCode: 429,
      message: 'Too Many Requests',
      error: 'Too Many Requests',
    });
    expect(limited?.body.requestId).toBe(limited?.headers['x-request-id']);
  });

  it('does not throttle the health endpoint', async () => {
    const responses = await Promise.all(
      Array.from({ length: 301 }, () =>
        request(app.getHttpServer())
          .get('/api')
          .set('x-api-key', 'test-api-key'),
      ),
    );

    expect(responses.every((response) => response.status === 200)).toBe(true);
  });
});
