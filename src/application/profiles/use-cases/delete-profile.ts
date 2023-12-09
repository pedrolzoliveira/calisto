import { prismaClient } from '@/src/infra/database/prisma/client';

export const deleteProfile = async (id: string) => {
  await prismaClient.$transaction(async tx => {
    await tx.profileCategory.deleteMany({
      where: { profileId: id }
    });

    await tx.profile.delete({
      where: { id }
    });
  });
};
