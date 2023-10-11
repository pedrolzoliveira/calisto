import { server } from '@/src/infra/http/server'
import { logger } from '@/src/infra/logger'
import { env } from '@/src/config/env'

server.listen(env.PORT, () => {
  logger.info(`listening on port ${env.PORT}`)
})
