import { prismaClient } from '@/src/infra/database/prisma/client';
import { calculateCategoriesEmbeddingsQueue } from '../queues/calculate-categories-embeddings';
import { calculateEmbeddings } from '../../chat-gpt/use-cases/calculate-embedding';
import { logger } from '@/src/infra/logger';
import { Prisma } from '@prisma/client';

export const calculateCategoriesEmbeddingsConsumer = calculateCategoriesEmbeddingsQueue.createConsumer(async ({ categories }) => {
  logger.info(`Calculating categories embeddings for categories: ${JSON.stringify(categories)}`);

  const categoriesText = await prismaClient.$queryRaw<{ text: string }[]>`SELECT "text" FROM "Category" WHERE "text" IN (${Prisma.join(categories)}) AND "embedding" IS NULL`;

  const embeddings = await calculateEmbeddings(categoriesText.map(({ text }) => text));

  for (const { text, embedding } of embeddings) {
    await prismaClient.$executeRaw`UPDATE "Category" SET "embedding" = ${embedding} WHERE "text" = ${text}`;
  }
});
