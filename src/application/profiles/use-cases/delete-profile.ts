import { prismaClient } from '@/src/infra/database/prisma/client';

export const deleteProfile = async (id: string) => {
  await prismaClient.profile.delete({
    where: { id }
  });
};
