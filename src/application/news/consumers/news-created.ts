import { logger } from '@/src/infra/logger';
import { newsCreatedQueue } from '../queues/news-created';
import { Consumer } from '@/src/infra/messaging/rabbitmq/consumer';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { calculateEmbeddings } from '../../chat-gpt/use-cases/calculate-embedding';
import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space';
import { isWithinTokenLimit } from 'gpt-tokenizer';
import { MODELS } from '../../chat-gpt/models';

export const newsCreatedConsumer = new Consumer({
  queue: newsCreatedQueue,
  fn: async ({ link }) => {
    logger.info(`news-created consumer: ${link}`);
    const news = await prismaClient.news.findFirst({
      where: { link },
      select: { content: true }
    });

    if (!news?.content) {
      return;
    }

    const contentSanitized = sanitizeWhiteSpace(news.content);

    if (!isWithinTokenLimit(contentSanitized, MODELS.TEXT_EMBEDDING_3_SMALL.limit)) {
      return;
    }

    const [{ embedding }] = await calculateEmbeddings([contentSanitized]);

    await prismaClient.$executeRaw`UPDATE "News" SET "embedding" = ${embedding} WHERE "link" = ${link}`;
  }
});
