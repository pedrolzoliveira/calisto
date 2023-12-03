import { prismaClient } from '@/src/infra/database/prisma/client'
import { profileCategoryChangedQueue } from '../queues/profile-category-changed'

interface CreateProfileData {
  userId: string
  name: string
  categories: string[]
}

export const CreateProfile = async ({ name, categories, userId }: CreateProfileData) => {
  const profile = await prismaClient.profile.create({
    data: {
      userId,
      name,
      categories: { createMany: { data: categories.map(category => ({ category })) } }
    }
  })

  // await profileCategoryChangedQueue.send({ profileId: profile.id })

  return profile
}
