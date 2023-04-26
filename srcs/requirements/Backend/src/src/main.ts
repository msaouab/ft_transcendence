import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { Body, ValidationPipe, VersioningType } from '@nestjs/common';
import bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';




// const APP_ROUTE_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //ejs temp front end
  app.useStaticAssets(join('/', 'home', 'public'));
  app.setBaseViewsDir(join('/', 'home', 'views'));
  app.setViewEngine('ejs');
  //end ejs

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
  // express session
  app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
    store: new session.MemoryStore(),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  }),
  );
  app.use(cookieParser());
  // app.use(cookieParser());
  //secret from .env

  //passport start
  app.use(passport.initialize());
  app.use(passport.session());
  //passport end


  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
