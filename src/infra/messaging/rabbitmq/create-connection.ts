import { env } from '@/src/config/env'
import { connect } from 'amqplib'

export const createConnection = async () => {
  return await connect(env.RABBIT_MQ_URL)
}
