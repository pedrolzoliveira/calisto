import { type News } from '@prisma/client';
import { type Factory } from './factory';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { sourceFactory } from './source-factory';

class NewsFactory implements Factory<News> {
  async create(attributes?: Partial<News> | undefined): Promise<News> {
    const foreignKeys = {
      sourceCode: attributes?.sourceCode ?? (await sourceFactory.create()).code
    };

    const newsSchema = z.object({
      link: z.string().url().default(faker.internet.url()),
      title: z.string().default(faker.lorem.sentence()),
      description: z.string().default(faker.lorem.paragraph()),
      content: z.string().default(faker.lorem.paragraphs()),
      imageUrl: z.string().url().default(faker.internet.avatar()),
      createdAt: z.date().default(new Date())
    }).default({});

    return await prismaClient.news.create({
      data: {
        ...newsSchema.parse(attributes),
        ...foreignKeys
      }
    });
  }
}

export const newsFactory = new NewsFactory();
