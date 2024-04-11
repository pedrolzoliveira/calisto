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
    const result = await prismaClient.$queryRaw<Array<{ id: string }>>`
      UPDATE queues
      SET running = true
      WHERE id = (
          SELECT id
          FROM queues
          WHERE key = ${key}
          AND tries < 3
          AND running = false
          ORDER BY created_at
          LIMIT 1
      )
      RETURNING id;
    `;

    if (!result.length) {
      return;
    }

    const { id } = result[0];

    const queue = await prismaClient.queue.findUnique({
      where: { id }
    });

    if (!queue) {
      return;
    }

    try {
      await consumeFn(queue.data as z.infer<TSchema>);
      await prismaClient.queue.delete({
        where: { id: queue.id }
      });
    } catch (error) {
      console.error(error);
      await prismaClient.queue.update({
        where: {
          id: queue.id
        },
        data: {
          errors: [...queue.errors, (error as Error).message],
          tries: queue.tries + 1
        }
      }).catch(logger.error);

      await prismaClient.$executeRaw`
        UPDATE queues
        SET running = false
        WHERE id = ${queue.id};
      `;

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
    // Should not be here but while testing I found out is possible some notification get lost somehow
    setInterval(run, 10_000);
  }

  return {
    publish,
    consume
  };
}
