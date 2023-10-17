import { prismaClient } from '@/src/infra/database/prisma/client'
import { type Source } from '@prisma/client'

interface getNewsFeedParams {
  limit: number
  skip: number
  profileId: string
}

export const getNewsFeed = async ({ limit, skip, profileId }: getNewsFeedParams) => {
  return await prismaClient.$queryRaw<Array<{
    link: string
    title: string
    description: string | null
    imageUrl: string | null
    createdAt: Date
    categories: string[]
    source: Source
  }>>`SELECT
        "News"."link",
        "News"."title",
        "News"."description",
        "News"."imageUrl",
        "News"."createdAt",
        array_agg("NewsCategory".category) AS categories,
        row_to_json("Source") AS source
      FROM
        "News"
        LEFT JOIN "Source" ON "Source"."code" = "News"."sourceCode"
        LEFT JOIN "NewsCategory" ON "NewsCategory"."newsLink" = "News"."link"
        LEFT JOIN "ProfileCategory" ON "ProfileCategory"."category" = "NewsCategory"."category"
      WHERE
        "ProfileCategory"."profileId" = ${profileId}
      GROUP BY
        "News"."link",
        "Source"."code"
      ORDER BY
        "News"."createdAt" DESC
      LIMIT
        ${limit}
      OFFSET
        ${skip};`
}
