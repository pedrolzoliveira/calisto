import { type z, type AnyZodObject } from 'zod'
import { type Channel } from 'amqplib'
import { createChannel } from './create-channel'
import { logger } from '@/src/infra/logger'

export interface CreateQueueArgs<T extends AnyZodObject = AnyZodObject> {
  name: string
  schema: T
  consumeFunction: (data: z.infer<T>) => any
}

export const createQueue = <T extends AnyZodObject>(args: CreateQueueArgs<T>) => {
  let channel: Channel

  const assertQueue = async () => {
    if (!channel) {
      channel = await createChannel()
      await channel.assertQueue(args.name)
    }
  }

  const consume = async () => {
    await assertQueue()

    logger.info('consume', args.name)
    channel.consume(args.name, async (message) => {
      if (message) {
        const data = args.schema.parse(
          JSON.parse(message.content.toString())
        )

        await args.consumeFunction(data)
        channel.ack(message)
      }
    })
  }

  const send = async (data: z.infer<T>) => {
    await assertQueue()

    const parsedData = args.schema.parse(data)
    return channel.sendToQueue(args.name, Buffer.from(JSON.stringify(parsedData)))
  }

  return {
    consume,
    send
  }
}
