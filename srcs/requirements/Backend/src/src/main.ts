import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { Body, ValidationPipe, VersioningType } from '@nestjs/common';
import bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';

// importing cors
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { SocketAdapter } from './socket.adapter';
export const HOSTNAME= process.env.HOSTNAME || 'localhost';

// const APP_ROUTE_PREFIX = 'api';

const origin = 'http://localhost:5173';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: 'http://' + HOSTNAME +':5173',
      // origin: "*",
      credentials: true,
    }
  });

  //ejs temp front end
  app.useStaticAssets(join('/','app', 'public'));
  app.setBaseViewsDir(join('/','app', 'views'));
  app.setViewEngine('ejs');
  //end ejs
  
  const config = new DocumentBuilder()
  .setTitle('Pong API')
  .setDescription('The Pong API description')
  .setVersion('1.0')
  // .addTag('pong')
  .build();
  // this is the line that enables versioning
  // api versioning is /api/v1/... so if shit happens moving on you can just /api/v2/...
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
  //secret from .env

  //passport start
  app.use(passport.initialize());
  app.use(passport.session());
  //passport end



  app.useWebSocketAdapter(new SocketAdapter(app));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
