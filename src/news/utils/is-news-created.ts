import { prismaClient } from '@/prisma/client'

export const isNewsCreated = async (link: string) => {
  return Boolean(await prismaClient.news.findUnique({
    select: { link: true },
    where: { link }
  }))
}
