import { z } from 'zod'
import { Queue } from '@/src/infra/messaging/rabbitmq/queue'
import { prismaClient } from '@/src/infra/database/prisma/client'
import { relateCategories } from '../use-cases/relate-categories'
import { logger } from '@/src/infra/logger'

export const relateCategoriesSchema = z.object({
  link: z.string(),
  content: z.string(),
  categories: z.string().array()
})

export const relateCategoriesQueue = new Queue({
  name: 'relate-categories',
  schema: relateCategoriesSchema,
  consumeFunction: async ({ link, content, categories }) => {
    logger.info('queues/relate-categories', link, categories)

    const relatedCategories = await relateCategories(content, categories)

    logger.info('relatedCategories', relatedCategories)

    if (relateCategories.length) {
      await prismaClient.newsCategory.createMany({
        data: relatedCategories.map((category) => ({
          newsLink: link,
          category
        }))
      })
    }
  }
})
