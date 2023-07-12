import { z } from 'zod'
import { createQueue } from '@/rabbitmq/create-queue'
import { relateCategories } from '../use-cases/relate-categories'
import { prismaClient } from '@/prisma/client'

export const relateCategoriesSchema = z.object({
  link: z.string(),
  content: z.string(),
  categories: z.string().array().nonempty()
})

export const relateCategoriesQueue = createQueue({
  name: 'relate-categories',
  schema: relateCategoriesSchema,
  consumeFunction: async ({ link, content, categories }) => {
    console.log('queues/relate-categories', link, categories)

    const relatedCategories = await relateCategories(content, categories)

    await prismaClient.newsTag.createMany({
      data: relatedCategories.map((category) => ({
        newsLink: link,
        tag: category
      }))
    })
  }
})
