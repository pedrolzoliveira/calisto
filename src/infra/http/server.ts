import 'express-async-errors'

import express, { urlencoded } from 'express'
import session from 'express-session'
import { join } from 'path'
import { type TemplateResult } from 'lit'
import { render } from '@lit-labs/ssr'

import { newsController } from '@/src/application/news/controller'
import { profilesController } from '@/src/application/profiles/controller'
import { RenderResultReadable } from '@lit-labs/ssr/lib/render-result-readable'
import { processBatchesController } from '@/src/application/process-batches/controller'
import { usersController } from '@/src/application/users/controller'
import { env } from '@/src/config/env'

export const server = express()

server.use(session({ secret: env.SESSION_SECRET, saveUninitialized: false, resave: false }))

server.use((req, res, next) => {
  res.renderTemplate = (template: TemplateResult | TemplateResult[]) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    const readableResult = new RenderResultReadable(render(template))
    readableResult.pipe(res)
  }
  next()
})

server.use('/dist', express.static(join(__dirname, 'www', 'dist')))
server.use(urlencoded({ extended: true }))

server.use('/news', newsController)
server.use('/profiles', profilesController)
server.use('/process-batches', processBatchesController)
server.use('/users', usersController)
