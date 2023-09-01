import { server } from '@/src/infra/http/server'
import { env } from '@/src/config/env'
import { logger } from '@/src/infra/logger'

server.listen(env.PORT, () => {
  logger.info(`listening on port ${env.PORT}`)
})
