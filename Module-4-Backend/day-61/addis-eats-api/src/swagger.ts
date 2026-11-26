import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Addis Eats API')
    .setDescription(
      'API for browsing Addis Eats restaurants and managing delivery orders. Requests require the configured x-api-key header; request processing is limited to five seconds.',
    )
    .setVersion('1.0.0')
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'x-api-key' },
      'api-key',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  writeFileSync(
    resolve(process.cwd(), 'openapi.json'),
    JSON.stringify(document, null, 2),
  );
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('docs', app, document);
  }
  return document;
}
