import { prismaClient } from '@/src/infra/database/prisma/client';
import { profileCategoryChangedQueue } from '../queues/profile-category-changed';

export const updateProfile = async (
  data: {
    id: string
    name: string
    categories: string[]
  }
) => {
  return await prismaClient.$transaction(async tx => {
    await tx.profileCategory.deleteMany({ where: { profileId: data.id } });
    const profile = await tx.profile.update({
      select: {
        id: true,
        name: true,
        categories: true,
        createdAt: true
      },
      data: {
        name: data.name,
        categories: {
          createMany: {
            data: data.categories.map(category => ({ category }))
          }
        }
      },
      where: { id: data.id }
    });

    await profileCategoryChangedQueue.send({ profileId: profile.id });

    return profile;
  });
};
