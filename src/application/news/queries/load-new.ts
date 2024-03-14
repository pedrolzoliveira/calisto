import { prismaClient } from '@/src/infra/database/prisma/client';
import { type Source } from '@prisma/client';

interface getNewsFeedParams {
  profileId: string
  cursor: Date
}

type queryResult = Array<{
  link: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
  categories: string[]
  batchesIds: string[]
  source: Source
}>

export const loadNew = async ({ profileId, cursor }: getNewsFeedParams): Promise<Array<{
  link: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
  categories: string[]
  source: Source
}>> => {
  return await prismaClient.$queryRaw<queryResult>`
    WITH CategoryEmbeddings AS (
      SELECT
        text,
        embedding
      FROM
        "Category"
      WHERE
        "text" IN(
          SELECT
            "A" FROM "_CategoryToProfile"
          WHERE
            "B" = ${profileId})
    )
    SELECT
      "News".link,
      "News".title,
      "News".description,
      "News"."imageUrl",
      "News"."createdAt",
      ARRAY_AGG(CategoryEmbeddings.text) AS categories,
      row_to_json("Source") AS source
    FROM
      "News"
      JOIN "Source" ON "Source".code = "News"."sourceCode"
      JOIN CategoryEmbeddings ON (CategoryEmbeddings.embedding <=> "News".embedding) <= .6
    WHERE "News"."createdAt" > ${cursor}
    GROUP BY
      "News".link,
      "Source".code
    ORDER BY "News"."createdAt" DESC;`;
};
