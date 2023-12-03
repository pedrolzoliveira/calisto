import { type User } from '@prisma/client'
import { type Factory } from './factory'
import { z } from 'zod'
import { faker } from '@faker-js/faker'
import { prismaClient } from '@/src/infra/database/prisma/client'

class UserFactory implements Factory<User> {
  async create(attributes?: Partial<User> | undefined): Promise<User> {
    const userSchema = z.object({
      id: z.string().uuid().default(faker.string.uuid()),
      email: z.string().email().default(faker.internet.email()),
      role: z.enum(['admin', 'user']).default('user')
    }).default({})

    return await prismaClient.user.create({ data: userSchema.parse(attributes) })
  }
}

export const userFactory = new UserFactory()
