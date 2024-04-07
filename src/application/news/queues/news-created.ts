import { createQueue } from '@/src/infra/database/queue';
import { z } from 'zod';
import { decode, encode, isWithinTokenLimit } from 'gpt-tokenizer';
import { calculateEmbeddings } from '../../chat-gpt/use-cases/calculate-embedding';
import { MODELS } from '../../chat-gpt/models';
import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { Prisma } from '@prisma/client';
import { logger } from '@/src/infra/logger';

export const newsCreatedSchema = z.object({
  link: z.string()
});

async function splitEmbedding(content: string) {
  const contentEncoded = encode(content);
  const numSections = Math.ceil(contentEncoded.length / MODELS.TEXT_EMBEDDING_3_SMALL.limit);
  const sectionLength = Math.ceil(contentEncoded.length / numSections);

  const embeddings: number[][] = [];

  for (let sectionIndex = 0; sectionIndex < numSections; sectionIndex++) {
    const sectionStart = sectionLength * sectionIndex;
    const sectionEnd = sectionLength * (sectionIndex + 1);
    const sectionEncoded = contentEncoded.splice(sectionStart, sectionEnd);
    const section = decode(sectionEncoded);

    const [{ embedding }] = await calculateEmbeddings([section]);

    embeddings.push(embedding);
  }

  return embeddings;
};

export const newsCreatedQueue = createQueue({
  key: 'news-created',
  schema: newsCreatedSchema,
  consumeFn: async ({ link }) => {
    logger.info(`news-created consumer: ${link}`);
    const news = await prismaClient.news.findFirst({
      where: { link },
      select: { content: true }
    });

    if (!news?.content) {
      return;
    }

    const contentSanitized = sanitizeWhiteSpace(news.content);

    if (isWithinTokenLimit(contentSanitized, MODELS.TEXT_EMBEDDING_3_SMALL.limit)) {
      const [{ embedding }] = await calculateEmbeddings([contentSanitized]);

      return await prismaClient.$executeRaw`
        INSERT INTO "NewsEmbedding" ("newsSectionIndex", "link", "embedding")
        VALUES ${Prisma.sql`(${Prisma.join([0, link, embedding])})`};
      `;
    }

    const embeddings = await splitEmbedding(contentSanitized);

    if (!embeddings.length) {
      return;
    }

    await prismaClient.$executeRaw`
      INSERT INTO "NewsEmbedding" ("newsSectionIndex", "link", "embedding")
      VALUES ${Prisma.join(
        embeddings.map((embedding, sectionIndex) => Prisma.sql`(${Prisma.join([sectionIndex, link, embedding])})`)
      )};
    `;
  }
});
