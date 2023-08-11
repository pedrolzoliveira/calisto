import { server } from './http/server'
import { env } from '@/config/env'

server.listen(env.PORT, () => {
  console.log(`listening on port ${env.PORT}`)
})
