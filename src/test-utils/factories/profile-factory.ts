import { type Profile } from '@prisma/client';
import { type Factory } from './factory';
import { z } from 'zod';
import { faker } from '@faker-js/faker';

import { userFactory } from './user-factory';
import { prismaClient } from '@/src/infra/database/prisma/client';

class ProfileFactory implements Factory<Profile & { categories: string[] }> {
  async create(attributes?: Partial<Omit<Profile, 'id' | 'createdAt'>> & { categories?: string[] }) {
    const foreignKeys = {
      userId: attributes?.userId ?? (await userFactory.create()).id
    };

    const profileSchema = z.object({
      name: z.string().default(faker.word.words()),
      categories: z.string().array().default(Array.from({ length: 5 }, () => faker.lorem.words(3)))
    }).default({});

    const { name, categories } = profileSchema.parse(attributes);

    return await prismaClient.profile.create({
      select: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        categories: true
      },
      data: {
        userId: foreignKeys.userId,
        name,
        categories
      }
    });
  }
}

export const profileFactory = new ProfileFactory();
