import { prismaClient } from '@/src/infra/database/prisma/client'
import { relateCategoriesQueue } from '@/src/services/chat-gpt/queues/relate-categories'

export interface RelateCategoriesData {
  link: string
  content: string
}

export const relateCategories = async ({ link, content }: RelateCategoriesData) => {
  const categories = await prismaClient.$queryRaw<Array<{ category: string }>>`SELECT DISTINCT category From "ProfileCategory"`
  await relateCategoriesQueue.send({
    link,
    content,
    categories: categories.map(({ category }) => category)
  })
}
