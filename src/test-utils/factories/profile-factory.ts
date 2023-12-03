import { type Profile } from '@prisma/client'
import { type Factory } from './factory'
import { z } from 'zod'
import { faker } from '@faker-js/faker'

import { userFactory } from './user-factory'
import { prismaClient } from '@/src/infra/database/prisma/client'

class ProfileFactory implements Factory<Profile & { categories: string[] }> {
  async create(attributes?: Partial<Omit<Profile, 'id' | 'createdAt'>> & { categories?: string[] }): Promise<Profile & { categories: string[] }> {
    const foreignKeys = {
      userId: attributes?.userId ?? (await userFactory.create()).id
    }

    const profileSchema = z.object({
      name: z.string().default(faker.word.words()),
      categories: z.string().array().default(new Array(5).fill(null).map(() => faker.lorem.word()))
    }).default({})

    const { name, categories } = profileSchema.parse(attributes)

    return await prismaClient.profile.create({
      select: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        categories: { select: { category: true } }
      },
      data: {
        userId: foreignKeys.userId,
        name,
        categories: { createMany: { data: categories.map(category => ({ category })) } }
      }
    }).then(profile => ({
      ...profile,
      categories: profile.categories.map(({ category }) => category)
    }))
  }
}

export const profileFactory = new ProfileFactory()
