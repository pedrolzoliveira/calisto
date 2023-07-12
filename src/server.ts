import { env } from '@/config/env'
import cors from 'cors'
import express, { json } from 'express'
import { newsController } from './news/controller'
import { profilesController } from './profiles/controller'

const server = express()

server.use(json())
server.use(cors({ origin: env.CORS_ORIGIN }))

server.use('/profiles', profilesController)
server.use('/news', newsController)

server.listen(env.PORT, () => {
  console.log(`listening on port ${env.PORT}`)
})
