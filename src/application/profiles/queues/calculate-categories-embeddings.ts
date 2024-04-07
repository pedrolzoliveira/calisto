import { createQueue } from '@/src/infra/database/queue';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { z } from 'zod';
import { calculateEmbeddings } from '../../chat-gpt/use-cases/calculate-embedding';
import { Prisma } from '@prisma/client';
import { logger } from '@/src/infra/logger';

export const calculateCategoriesEmbeddingsSchema = z.object({
  categories: z.string().array()
});

async function getCategoriesToCalculate(categories: string[]): Promise<string[]> {
  const categoriesText = (await prismaClient.$queryRaw<{ text: string }[]>`SELECT "text" FROM "CategoryEmbedding" WHERE "text" IN (${Prisma.join(categories)});`).map(({ text }) => text);

  return categories.filter(category => !categoriesText.includes(category));
};

export const calculateCategoriesEmbeddingsQueue = createQueue({
  key: 'calculate-categories-embeddings',
  schema: calculateCategoriesEmbeddingsSchema,
  consumeFn: async ({ categories }) => {
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
  }
});
