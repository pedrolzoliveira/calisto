import { prismaClient } from '@/src/infra/database/prisma/client'
import { type Source } from '@prisma/client'

interface getNewsFeedParams {
  limit: number
  profileId: string
  cursor: Date
}

export const getNewsFeed = async ({ limit, profileId, cursor }: getNewsFeedParams): Promise<Array<{
  link: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
  categories: string[]
  source: Source
  lastRow: boolean
}>> => {
  return await prismaClient.$queryRaw`
      WITH RankedNews AS (
        SELECT
          "News"."link",
          "News"."title",
          "News"."description",
          "News"."imageUrl",
          "News"."createdAt",
          array_agg("NewsCategory".category) AS categories,
          row_to_json("Source") AS source,
          ROW_NUMBER() OVER (ORDER BY "News"."createdAt" ASC) AS row_num
        FROM
          "News"
          LEFT JOIN "Source" ON "Source"."code" = "News"."sourceCode"
          LEFT JOIN "NewsCategory" ON "NewsCategory"."newsLink" = "News"."link"
          LEFT JOIN "ProfileCategory" ON "ProfileCategory"."category" = "NewsCategory"."category"
        WHERE
          "ProfileCategory"."profileId" = ${profileId}
          AND "News"."createdAt" < ${cursor}
        GROUP BY
          "News"."link",
          "Source"."code"
      )
      SELECT
        "link",
        "title",
        "description",
        "imageUrl",
        "createdAt",
        categories,
        source,
        (row_num = 1) AS "lastRow"
      FROM RankedNews
      ORDER BY "createdAt" DESC
      LIMIT ${limit};`
}
