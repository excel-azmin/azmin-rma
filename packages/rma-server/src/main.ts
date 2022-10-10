import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { GLOBAL_API_PREFIX } from './constants/app-strings';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const server = new ExpressAdapter(express());
  const app = await NestFactory.create(AppModule, server);
  const config = new DocumentBuilder()
    .setTitle('RMA API')
    .setDescription('Excel Rma apps')
    .setVersion('1.0')
    .addTag('rma')
    .build();
  app.enableCors();
  app.setGlobalPrefix(GLOBAL_API_PREFIX);
  setupSwagger(app);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(8800);
}
bootstrap();
