import { prismaClient } from '@/src/infra/database/prisma/client';
import { calculateCategoriesEmbeddingsQueue } from '../queues/calculate-categories-embeddings';
import { calculateEmbeddings } from '../../chat-gpt/use-cases/calculate-embedding';
import { logger } from '@/src/infra/logger';
import { Prisma } from '@prisma/client';

const getCategoriesToCalculate = async (categories: string[]): Promise<string[]> => {
  const categoriesText = (await prismaClient.$queryRaw<{ text: string }[]>`SELECT "text" FROM "CategoryEmbedding" WHERE "text" IN (${Prisma.join(categories)});`).map(({ text }) => text);

  return categories.filter(category => !categoriesText.includes(category));
};

export const calculateCategoriesEmbeddingsConsumer = calculateCategoriesEmbeddingsQueue.createConsumer(async ({ categories }) => {
  logger.info(`Calculating categories embeddings for categories: ${JSON.stringify(categories)}`);

  const categoriesToCalculate = await getCategoriesToCalculate(categories);

  if (!categoriesToCalculate.length) {
    return;
  }

  const embeddings = await calculateEmbeddings(categoriesToCalculate);

  await prismaClient.$executeRaw`
    INSERT INTO "CategoryEmbedding" ("text", "embedding")
    VALUES ${Prisma.join(
      embeddings.map(({ text, embedding }) => Prisma.sql`(${Prisma.join([text, embedding])})`)
    )}
    ON CONFLICT DO NOTHING;
  `;
});
