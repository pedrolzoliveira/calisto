import { prismaClient } from '@/src/infra/database/prisma/client'

export const populateNewsCategory = async (newsLink: string) => {
  try {
    return await prismaClient.$executeRaw`
    INSERT INTO
      "NewsCategory" ("category", "newsLink", "related", "processed")
    SELECT DISTINCT
      "category",
      ${newsLink},
      false,
      false
    FROM
      "ProfileCategory"
    ON CONFLICT DO NOTHING;
    `
  } catch (error) {
    console.error('error when populating news category, news link:', newsLink)
    // throw error
  }
}
