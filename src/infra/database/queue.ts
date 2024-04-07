import { logger } from '../logger';
import { prismaClient } from './prisma/client';
import { subscriber } from './subscriber';
import { type z, type AnyZodObject } from 'zod';

export function createQueue<TSchema extends AnyZodObject = AnyZodObject>(params: {
  key: string
  schema: TSchema
  consumeFn: (data: z.infer<TSchema>) => Promise<any>
}) {
  const { key, schema, consumeFn } = params;

  async function publish(data: z.infer<TSchema>) {
    const dataValidation = schema.safeParse(data);

    if (!dataValidation.success) {
      throw new Error(`Invalid data for queue ${key}: ${dataValidation.error.message}`);
    }

    const queue = await prismaClient.queue.create({
      data: {
        key,
        data: dataValidation.data
      }
    });

    await subscriber.notify(key);

    return queue;
  }

  async function run() {
    const queue = await prismaClient.queue.findFirst({
      where: {
        key,
        tries: { lt: 3 }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!queue) {
      return;
    }

    try {
      await consumeFn(queue.data as z.infer<TSchema>);
      await prismaClient.queue.delete({
        where: {
          id: queue.id
        }
      });
    } catch (error) {
      logger.error(error);
      await prismaClient.queue.update({
        where: {
          id: queue.id
        },
        data: {
          errors: [...queue.errors, (error as Error).message],
          tries: queue.tries + 1
        }
      });
      await subscriber.notify(key);
    }
  }

  async function count() {
    return await prismaClient.queue.count({
      where: {
        key,
        tries: { lt: 3 }
      }
    });
  }

  async function consume() {
    while (await count()) {
      await run();
    }
    await subscriber.listenTo(key);
    subscriber.notifications.on(key, async () => {
      await run();
    });
  }

  return {
    publish,
    consume
  };
}
