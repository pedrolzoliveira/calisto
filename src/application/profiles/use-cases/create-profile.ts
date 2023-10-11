import { prismaClient } from '@/src/infra/database/prisma/client'

interface CreateProfileData {
  name: string
  categories: string[]
}

export const CreateProfile = async ({ name, categories }: CreateProfileData) => {
  return await prismaClient.profile.create({
    data: {
      name,
      categories: { createMany: { data: categories.map(category => ({ category })) } }
    }
  })
}
