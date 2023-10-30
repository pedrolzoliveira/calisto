import 'express-async-errors'

import express, { urlencoded } from 'express'
import helpers from 'handlebars-helpers'
import { create } from 'express-handlebars'
import { join } from 'path'

import { newsController } from '@/src/application/news/controller'
import { profilesController } from '@/src/application/profiles/controller'
import { type TemplateResult } from 'lit'
import { render } from '@lit-labs/ssr'
import { RenderResultReadable } from '@lit-labs/ssr/lib/render-result-readable'

export const server = express()

const hbs = create({
  extname: '.hbs',
  helpers: {
    ...helpers(),
    formatDate: (date: Date) => `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  },
  partialsDir: [
    join(__dirname, 'www', 'views', 'partials'),
    join(__dirname, 'www', 'views', 'layouts')
  ]
})

server.engine('.hbs', hbs.engine)
server.set('view engine', '.hbs')
server.set('views', join(__dirname, 'www', 'views'))

server.use((req, res, next) => {
  res.renderTemplate = (template: TemplateResult | TemplateResult[]) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    const readableResult = new RenderResultReadable(render(template))
    res.send(readableResult.read())
  }
  next()
})

server.use('/dist', express.static(join(__dirname, 'www', 'dist')))
server.use(urlencoded({ extended: true }))

server.use('/news', newsController)
server.use('/profiles', profilesController)
