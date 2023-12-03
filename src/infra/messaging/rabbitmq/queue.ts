import { type z, type AnyZodObject } from 'zod'
import { type Channel } from 'amqplib'
import { Publisher } from './publisher'
import { Consumer } from './consumer'

export interface QueueArgs<TSchema extends AnyZodObject = AnyZodObject, TName extends string = string> {
  name: TName
  schema: TSchema
  channel?: Channel
}

export class Queue<TSchema extends AnyZodObject = AnyZodObject, TName extends string = string> {
  private channel?: Channel
  readonly name: TName
  readonly schema: TSchema

  constructor(args: QueueArgs<TSchema, TName>) {
    this.name = args.name
    this.schema = args.schema
    this.channel = args.channel
  }

  public bindChannel(channel: Channel) {
    this.channel = channel
    return this
  }

  public async assertQueue() {
    if (!this.channel) {
      throw new Error('Channel not bound')
    }

    await this.channel.assertQueue(this.name)
  }

  public createConsumer(fn: (data: z.infer<TSchema>) => any) {
    return new Consumer({
      channel: this.channel,
      queue: this as Queue,
      fn
    })
  }

  public createPublisher() {
    return new Publisher({
      channel: this.channel,
      queues: [this as Queue<TSchema, TName>]
    })
  }

  /**
   * @throws {Error}
   */
  public createBuffer(data: z.infer<TSchema>) {
    const validation = this.schema.safeParse(data)
    if (!validation.success) {
      throw new Error(`Invalid data for queue ${this.name}: ${validation.error.message}`)
    }

    const validatedData = validation.data
    return Buffer.from(JSON.stringify(validatedData))
  }

  public async getMessageCount() {
    if (!this.channel) {
      throw new Error('Channel not bound')
    }

    const { messageCount } = await this.channel.checkQueue(this.name)
    return messageCount
  }
}
