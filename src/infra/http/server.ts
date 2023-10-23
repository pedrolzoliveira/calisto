import 'express-async-errors'

import express, { urlencoded } from 'express'
import helpers from 'handlebars-helpers'
import { create } from 'express-handlebars'
import { join } from 'path'

import { newsController } from '@/src/application/news/controller'
import { profilesController } from '@/src/application/profiles/controller'

export const server = express()

const hbs = create({
  extname: '.hbs',
  helpers: helpers(),
  partialsDir: [
    join(__dirname, 'www', 'views', 'partials'),
    join(__dirname, 'www', 'views', 'layouts')
  ]
})

server.engine('.hbs', hbs.engine)
server.set('view engine', '.hbs')
server.set('views', join(__dirname, 'www', 'views'))

server.use('/dist', express.static(join(__dirname, 'www', 'dist')))
server.use(urlencoded({ extended: true }))

server.use('/news', newsController)
server.use('/profiles', profilesController)
