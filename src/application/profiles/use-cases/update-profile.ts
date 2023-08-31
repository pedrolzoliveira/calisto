import { prismaClient } from '@/src/infra/database/prisma/client'

export const updateProfile = async (
  data: {
    id: string
    name: string
    categories: string[]
  }
) => {
  return await prismaClient.$transaction(async tx => {
    await tx.profileCategory.deleteMany({ where: { profileId: data.id } })
    return await tx.profile.update({
      data: {
        name: data.name,
        categories: {
          createMany: {
            data: data.categories.map(category => ({ category }))
          }
        }
      },
      where: { id: data.id }
    })
  })
}
