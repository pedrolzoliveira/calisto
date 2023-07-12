import { prismaClient } from '@/prisma/client'

export const deleteProfile = async (id: string) => {
  await prismaClient.profileTag.deleteMany({
    where: { profileId: id }
  })
  await prismaClient.profile.delete({
    where: { id }
  })
}
