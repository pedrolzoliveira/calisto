import { prismaClient } from '@/src/infra/database/prisma/client';
import { publisher } from '../../publisher';

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
      categories: {
        connectOrCreate: categories.map(category => ({
          where: { text: category },
          create: { text: category }
        }))
      }
    }
  });

  publisher.publish('calculate-categories-embeddings', { categories });

  return profile;
};
