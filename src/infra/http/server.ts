import 'express-async-errors'

import express from 'express'
import { join } from 'path'
import { viewController } from './www/controllers/views-controller'
// import express, { json } from 'express'
// import cors from 'cors'

// import { env } from '@/src/config/env'
// import { newsController } from '@/src/application/news/controller'
// import { profilesController } from '@/src/application/profiles/controller'
// import { errorHandler } from './error-handler'

export const server = express()

server.set('view engine', 'ejs')
server.set('views', join(__dirname, 'www', 'views'))

server.use('/dist', express.static(join(__dirname, 'www', 'dist')))

server.use('/', viewController)

// server.use(json())
// server.use(cors({ origin: env.CORS_ORIGIN }))

// server.use('/profiles', profilesController)
// server.use('/news', newsController)

// server.use(errorHandler)
