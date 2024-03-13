import { logger } from '@/src/infra/logger';
import { newsCreatedQueue } from '../queues/news-created';
import { Consumer } from '@/src/infra/messaging/rabbitmq/consumer';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { calculateEmbeddings } from '../../chat-gpt/use-cases/calculate-embedding';

export const newsCreatedConsumer = new Consumer({
  queue: newsCreatedQueue,
  fn: async ({ link }) => {
    logger.info(`news-created consumer: ${link}`);
    const { content } = await prismaClient.news.findFirstOrThrow({
      where: { link },
      select: { content: true }
    });

    const [{ embedding }] = await calculateEmbeddings([content]);

    await prismaClient.$executeRaw`UPDATE "News" SET "embedding" = ${embedding} WHERE "link" = ${link}`;
  }
});
