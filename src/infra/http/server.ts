import 'express-async-errors'
import express, { json } from 'express'
import cors from 'cors'
import { env } from '@/src/config/env'
import { newsController } from '@/src/application/news/controller'
import { profilesController } from '@/src/application/profiles/controller'
import { errorHandler } from './error-handler'

export const server = express()

server.use(json())
server.use(cors({ origin: env.CORS_ORIGIN }))

server.use('/profiles', profilesController)
server.use('/news', newsController)

server.use(errorHandler)
