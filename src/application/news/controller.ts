import { prismaClient } from '@/src/infra/database/prisma/client'
import { type Source } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

export const newsController = Router()

newsController.get('/',
  async (req, res) => {
    const data = z.object({
      limit: z.number({ coerce: true }).default(20),
      skip: z.number({ coerce: true }).default(0),
      profileId: z.string().uuid()
    }).parse(req.query)

    const news = await prismaClient.$queryRaw<Array<{
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
          "ProfileCategory"."profileId" = ${data.profileId}
        GROUP BY
          "News"."link",
          "Source"."code"
        ORDER BY
          "News"."createdAt" DESC
        LIMIT
          ${data.limit}
        OFFSET
          ${data.skip};`

    return res.status(200).send({
      count: news.length,
      news
    })
  }
)
