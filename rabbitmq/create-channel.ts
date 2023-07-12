import { env } from '@/config/env'
import { connect } from 'amqplib'

export const createChannel = async () => {
  const connection = await connect(env.RABBIT_MQ_URL)
  return await connection.createChannel()
}
