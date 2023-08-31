import { prismaClient } from '@/src/infra/database/prisma/client'
import { relateCategoriesQueue } from '@/src/services/chat-gpt/queues/relate-categories'
import { type News } from '@prisma/client'

export const relateCategories = async ({ link, content }: News) => {
  const categories = await prismaClient.$queryRaw<Array<{ category: string }>>`SELECT DISTINCT category From "ProfileCategory"`
  await relateCategoriesQueue.send({
    link,
    content,
    categories: categories.map(({ category }) => category)
  })
}
