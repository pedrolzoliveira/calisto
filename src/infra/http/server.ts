import 'express-async-errors';

import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { type TemplateResult } from 'lit';
import { render } from '@/src/packages/lit-ssr/render';
import { RenderResultReadable } from '@/src/packages/lit-ssr/render-result-readable';

import { applicationController } from '@/src/application/controller';
import { session } from './session';
import { asyncLocalStorage } from './async-storage';
import { env } from '@/src/config/env';

export const server = express();

server.use(cookieParser());

if (env.NODE_ENV === 'production') {
  server.set('trust proxy', 1);
}

server.use(session);

server.use((req, res, next) => {
  res.renderTemplate = (template: TemplateResult | TemplateResult[]) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const readableResult = new RenderResultReadable(render(template));
    readableResult.pipe(res);
  };
  next();
});

server.use((req, res, next) => {
  try {
    const { locale, timezone } = req.cookies;
    locale && asyncLocalStorage.getStore()?.set('locale', locale);
    timezone && asyncLocalStorage.getStore()?.set('timezone', timezone);
  } finally {
    next();
  }
});

server.use('/dist', express.static(join(__dirname, 'www', 'dist')));
server.use('/assets', express.static(join(__dirname, 'www', 'assets')));

server.use(urlencoded({ extended: true }));

server.use('/', applicationController);
