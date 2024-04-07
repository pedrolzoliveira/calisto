import { prismaClient } from '@/src/infra/database/prisma/client';
import { calculateCategoriesEmbeddingsQueue } from '../queues/calculate-categories-embeddings';

interface CreateProfileData {
  userId: string
  name: string
  categories: string[]
}

export const createProfile = async ({ name, categories, userId }: CreateProfileData) => {
  const profile = await prismaClient.profile.create({
    data: {
      userId,
      name,
      categories
    }
  });

  await calculateCategoriesEmbeddingsQueue.publish({ categories });

  return profile;
};
