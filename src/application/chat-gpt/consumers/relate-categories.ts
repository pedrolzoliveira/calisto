import { logger } from '@/src/infra/logger'
import { relateCategoriesQueue } from '../queues/relate-categories'
import { relateCategories } from '../use-cases/relate-categories'
import { prismaClient } from '@/src/infra/database/prisma/client'

relateCategoriesQueue.consume(async ({ link, content, categories }) => {
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
})
