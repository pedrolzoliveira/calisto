import { z } from 'zod'
import { createQueue } from '@/rabbitmq/create-queue'
import { prismaClient } from '@/prisma/client'
import { relateCategories } from '../use-cases/relate-categories'

export const relateCategoriesSchema = z.object({
  link: z.string(),
  content: z.string(),
  categories: z.string().array()
})

export const relateCategoriesQueue = createQueue({
  name: 'relate-categories',
  schema: relateCategoriesSchema,
  consumeFunction: async ({ link, content, categories }) => {
    console.log('queues/relate-categories', link, categories)

    const relatedCategories = await relateCategories(content, categories)

    console.log('relatedCategories', relatedCategories)

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
