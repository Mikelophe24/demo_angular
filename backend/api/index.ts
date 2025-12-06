import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../dist/app.module';
import * as express from 'express';

let cachedApp: any;

async function createApp() {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

export default async function handler(req: express.Request, res: express.Response) {
  const app = await createApp();
  return app(req, res);
}

