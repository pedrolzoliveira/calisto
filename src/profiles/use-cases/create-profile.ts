import { prismaClient } from '@/prisma/client'

interface CreateProfileData {
  name: string
  tags: string[]
}

export const CreateProfile = async ({ name, tags }: CreateProfileData) => {
  return await prismaClient.profile.create({
    data: {
      name,
      tags: {
        createMany: { data: tags.map(tag => ({ tag })) }
      }
    }
  })
}
