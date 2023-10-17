import 'express-async-errors'

import express, { urlencoded } from 'express'
import { join } from 'path'

import { newsController } from '@/src/application/news/controller'
import { profilesController } from '@/src/application/profiles/controller'

export const server = express()

server.set('view engine', 'ejs')
server.set('views', join(__dirname, 'www', 'templates'))

server.use('/dist', express.static(join(__dirname, 'www', 'dist')))
server.use(urlencoded({ extended: true }))

server.use('/news', newsController)
server.use('/profiles', profilesController)
