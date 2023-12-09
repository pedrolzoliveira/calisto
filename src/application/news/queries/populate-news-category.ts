import { prismaClient } from '@/src/infra/database/prisma/client'

export const populateNewsCategory = async (newsLink: string) => {
  try {
    return await prismaClient.$executeRaw`
    INSERT INTO
      "NewsCategory" ("id", "category", "newsLink", "related", "processed")
    SELECT DISTINCT
      gen_random_uuid(),
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
