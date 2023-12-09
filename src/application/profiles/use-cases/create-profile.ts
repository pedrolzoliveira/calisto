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
      categories: { createMany: { data: categories.map(category => ({ category })) } }
    }
  });

  publisher.publish('profile-category-changed', { profileId: profile.id });

  return profile;
};
