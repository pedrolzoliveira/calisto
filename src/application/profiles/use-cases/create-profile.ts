import { prismaClient } from '@/src/infra/database/prisma/client'
import { profileCategoryChangedQueue } from '../queues/profile-category-changed'

interface CreateProfileData {
  name: string
  categories: string[]
}

export const CreateProfile = async ({ name, categories }: CreateProfileData) => {
  const profile = await prismaClient.profile.create({
    data: {
      name,
      categories: { createMany: { data: categories.map(category => ({ category })) } }
    }
  })

  await profileCategoryChangedQueue.send({ profileId: profile.id })

  return profile
}
