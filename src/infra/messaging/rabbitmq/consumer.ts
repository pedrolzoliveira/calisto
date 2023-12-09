import { type Channel } from 'amqplib';
import { type Queue } from './queue';
import { type z } from 'zod';

interface ConsumerArgs<T extends Queue> {
  channel?: Channel
  queue: T
  fn: (data: z.infer<T['schema']>) => any
}

export class Consumer<T extends Queue> {
  private readonly queue: T;
  private readonly fn: (data: z.infer<T['schema']>) => any;
  private channel?: Channel;
  private consumerTag: string | null;

  constructor(args: ConsumerArgs<T>) {
    this.channel = args.channel;
    this.queue = args.queue;
    this.fn = args.fn;
    this.consumerTag = null;
  }

  public bindChannel(channel: Channel) {
    this.channel = channel;
    return this;
  }

  public async consume() {
    if (!this.channel) {
      throw new Error('Channel not bound');
    }

    const consumeReply = await this.channel.consume(this.queue.name, async (message) => {
      if (message) {
        const data = this.queue.schema.parse(JSON.parse(message.content.toString()));
        await this.fn(data);
        // @ts-expect-error this.channel is not undefined at this point
        this.channel.ack(message);
      }
    });

    this.consumerTag = consumeReply.consumerTag;
  }

  public async stop() {
    if (!this.channel) {
      throw new Error('Channel not bound');
    }

    if (!this.consumerTag) {
      throw new Error('Consumer tag is not defined');
    }

    await this.channel.cancel(this.consumerTag);
  }
}
