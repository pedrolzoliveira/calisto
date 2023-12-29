import 'express-async-errors';

import express, { urlencoded } from 'express';
import session from 'express-session';
import { join } from 'path';
import { type TemplateResult } from 'lit';
import { render } from '@lit-labs/ssr';
import { RenderResultReadable } from '@lit-labs/ssr/lib/render-result-readable';

import { env } from '@/src/config/env';
import { applicationController } from '@/src/application/controller';

export const server = express();

server.use(session({ secret: env.SESSION_SECRET, saveUninitialized: false, resave: false }));

server.use((req, res, next) => {
  res.renderTemplate = (template: TemplateResult | TemplateResult[]) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const readableResult = new RenderResultReadable(render(template));
    readableResult.pipe(res);
  };
  next();
});

server.use('/dist', express.static(join(__dirname, 'www', 'dist')));
server.use('/assets', express.static(join(__dirname, 'www', 'assets')));

server.use(urlencoded({ extended: true }));

server.use('/', applicationController);
