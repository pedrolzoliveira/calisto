import { server } from '@/src/infra/http/server'
import { env } from '@/src/config/env'

server.listen(env.PORT, () => {
  console.log(`listening on port ${env.PORT}`)
})
