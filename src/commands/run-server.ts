import { server } from '@/src/infra/http/server'
import { logger } from '@/src/infra/logger'
import { env } from '@/src/config/env'
import { prismaClient } from '../infra/database/prisma/client'
import { createConnection } from '../infra/messaging/rabbitmq/create-connection'

prismaClient.$connect().then(() => {
  server.listen(env.PORT, () => {
    logger.info(`listening on port ${env.PORT}`)
  })
}).catch((error) => {
  logger.error('error connecting to database:', error)
  process.exit(1)
})
