import { prismaClient } from '@/src/infra/database/prisma/client';
import { calculateCategoriesEmbeddingsQueue } from '../queues/calculate-categories-embeddings';

export const updateProfile = async (
  data: {
    id: string
    name: string
    categories: string[]
  }
) => {
  const profile = await prismaClient.profile.update({
    select: {
      id: true,
      name: true,
      categories: true,
      createdAt: true
    },
    data: {
      name: data.name,
      categories: data.categories
    },
    where: { id: data.id }
  });

  await calculateCategoriesEmbeddingsQueue.publish({ categories: data.categories });

  return profile;
};
