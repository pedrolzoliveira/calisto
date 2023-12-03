import { type Profile } from '@prisma/client'
import { type Factory } from './factory'
import { z } from 'zod'
import { faker } from '@faker-js/faker'

import { CreateProfile } from '@/src/application/profiles/use-cases/create-profile'
import { userFactory } from './user-factory'

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

    return {
      ...CreateProfile({ name, categories, userId: foreignKeys.userId }),
      categories
    } as any
  }
}

export const profileFactory = new ProfileFactory()
