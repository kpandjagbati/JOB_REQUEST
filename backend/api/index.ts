import 'reflect-metadata';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module.js';

const expressApp = express();
let ready: Promise<express.Express> | null = null;

async function createApp() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
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
  return expressApp;
}

function getApp() {
  if (!ready) ready = createApp();
  return ready;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const server = await getApp();
  server(req, res);
}
