import { server } from '@/src/infra/http/server'
import { logger } from '@/src/infra/logger'
import { env } from '@/src/config/env'
import { prismaClient } from '../infra/database/prisma/client'

prismaClient.$connect().then(() => {
  server.listen(env.PORT, () => {
    logger.info(`listening on port ${env.PORT}`)
  })
}).catch((error) => {
  logger.error(error)
  process.exit(1)
})
