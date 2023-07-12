import { prismaClient } from '@/prisma/client'

interface CreateNewsData {
  sourceCode: string
  link: string
  title: string
  description?: string
  content: string
  imageUrl?: string
}

export const createNews = async (data: CreateNewsData) => {
  return await prismaClient.news.create({ data })
}
