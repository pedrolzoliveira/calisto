import { type Queue } from './queue';
import { type z, type AnyZodObject } from 'zod';
import { type Channel } from 'amqplib';

interface PublisherArgs<T extends readonly Queue<AnyZodObject>[]> {
  queues: T
  channel?: Channel
}

export class Publisher<T extends readonly Queue<AnyZodObject>[]> {
  private readonly queues: Record<string, Queue<AnyZodObject>>;
  private channel?: Channel;

  constructor({ channel, queues }: PublisherArgs<T>) {
    this.channel = channel;
    this.queues = queues.reduce<Record<string, Queue<AnyZodObject>>>((acc, queue) => {
      acc[queue.name] = queue;
      return acc;
    }, {});
  }

  public bindChannel(channel: Channel) {
    this.channel = channel;
    return this;
  }

  publish<Q extends T[number]>(queueName: Q['name'], data: z.infer<Q['schema']>) {
    if (!this.channel) {
      throw new Error('Channel not bound');
    }

    const queue = this.queues[queueName];
    this.channel.sendToQueue(queue.name, queue.createBuffer(data));
  }
}
