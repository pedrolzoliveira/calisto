import { prismaClient } from '@/src/infra/database/prisma/client'

export const populateNewsCategory = async (newsLink: string, profileId: string | null = null) => {
  await prismaClient.$queryRaw`
    INSERT INTO
      "NewsCategory" ("category", "newsLink", "related", "processed")
    SELECT DISTINCT
      "category",
      ${newsLink},
      false,
      false
    FROM
      "ProfileCategory"
    WHERE
      "profileId" = ${profileId}
      OR ${profileId} IS NULL
    ON CONFLICT DO NOTHING;
    `
}
