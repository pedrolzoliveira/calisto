import { prismaClient } from '@/src/infra/database/prisma/client'

export const emailAvailable = async (email: string) => {
  return !await prismaClient.user.count({
    where: { email }
  })
}
