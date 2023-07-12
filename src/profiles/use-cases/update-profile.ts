import { prismaClient } from '@/prisma/client'

export const updateProfile = async (
  data: {
    id: string
    name: string
    tags: string[]
  }
) => {
  await prismaClient.profileTag.deleteMany({ where: { profileId: data.id } })
  return await prismaClient.profile.update({
    data: {
      name: data.name,
      tags: {
        createMany: {
          data: data.tags.map(tag => ({ tag }))
        }
      }
    },
    where: { id: data.id }
  })
}
