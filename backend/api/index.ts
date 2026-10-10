import 'reflect-metadata';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Express } from 'express';
import { AppModule } from '../src/app.module.js';

let expressApp: Express | null = null;
let ready: Promise<Express> | null = null;

async function createApp(): Promise<Express> {
  const instance = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(instance),
    { logger: ['error', 'warn', 'log'] },
  );

  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
  expressApp = instance;
  return instance;
}

function getApp() {
  if (!ready) ready = createApp();
  return ready;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getApp();
  return new Promise<void>((resolve) => {
    res.on('finish', () => resolve());
    app(req as never, res as never);
  });
}
