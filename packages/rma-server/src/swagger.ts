import { INestApplication } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP_NAME, SWAGGER_ROUTE } from './constants/app-strings';

export function setupSwagger(app: INestApplication) {
  const version = JSON.parse(
    readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
  ).version;
  const options = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription('Resource Server')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_ROUTE, app, document);
}
