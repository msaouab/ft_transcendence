import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';



// const APP_ROUTE_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Pong API')
    .setDescription('The Pong API description')
    .setVersion('1.0')
    // .addTag('pong')
    .build();
  // this is the line that enables versioning
  // api versioning is /api/v1/... so if shit happens later on you can just /api/v2/...
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: process.env.API_VERSION,
  })
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`api/v${process.env.API_VERSION}/docs`, app, document);
  await app.listen(3000);
}

bootstrap();
