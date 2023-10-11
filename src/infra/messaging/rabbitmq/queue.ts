import { type z, type AnyZodObject } from 'zod'
import { type Channel } from 'amqplib'
import { createChannel } from './create-channel'
import { logger } from '@/src/infra/logger'

export interface QueueArgs<T extends AnyZodObject = AnyZodObject> {
  name: string
  schema: T
  consumeFunction: (data: z.infer<T>) => any
}

export class Queue<T extends AnyZodObject = AnyZodObject> {
  private channel!: Channel
  private readonly name: string
  private readonly schema: T
  private readonly consumeFunction: (data: z.infer<T>) => any

  constructor(args: QueueArgs<T>) {
    this.name = args.name
    this.schema = args.schema
    this.consumeFunction = args.consumeFunction
  }

  private async assertQueue() {
    if (!this.channel) {
      this.channel = await createChannel()
      await this.channel.assertQueue(this.name)
    }
  }

  public async consume() {
    await this.assertQueue()
    logger.info('consume', this.name)

    this.channel.consume(this.name, async (message) => {
      if (message) {
        const data = this.schema.parse(JSON.parse(message.content.toString()))
        await this.consumeFunction(data)
        this.channel.ack(message)
      }
    })
  }

  public async send(data: z.infer<T>) {
    await this.assertQueue()

    const parsedData = this.schema.parse(data)
    return this.channel.sendToQueue(
      this.name, Buffer.from(JSON.stringify(parsedData))
    )
  }
}
