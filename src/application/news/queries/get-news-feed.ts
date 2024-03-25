import { prismaClient } from '@/src/infra/database/prisma/client';
import { type Source } from '@prisma/client';

interface getNewsFeedParams {
  limit: number
  profileId: string
  cursor: Date
}

type queryResult = Array<{
  link: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
  categories: Array<{ text: string, distance: number }>
  source: Source
  rowNum: number
}>

export const getNewsFeed = async ({ limit, profileId, cursor }: getNewsFeedParams): Promise<Array<{
  link: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
  categories: Array<{ text: string, distance: number }>
  source: Source
  lastRow: boolean
}>> => {
  const result = await prismaClient.$queryRaw<queryResult>`
    WITH CategoryEmbeddings AS (
      SELECT
        text,
        embedding
      FROM
        "CategoryEmbedding"
      WHERE
        "text" IN(
          SELECT UNNEST("categories")
          FROM "Profile"
          WHERE "id" = ${profileId})
    )
    SELECT
      "News".link,
      "News".title,
      "News".description,
      "News"."imageUrl",
      "News"."createdAt",
      json_agg(
        json_build_object(
          'text', CategoryEmbeddings.text,
          'distance', CategoryEmbeddings.embedding <=> "NewsEmbedding".embedding
        )
      ) AS categories,
      row_to_json("Source") AS source,
      ROW_NUMBER() OVER (ORDER BY "News"."createdAt" ASC) AS row_num
    FROM
      "News"
      JOIN "NewsEmbedding" ON "News"."link" = "NewsEmbedding"."link"
      JOIN "Source" ON "Source".code = "News"."sourceCode"
      JOIN CategoryEmbeddings ON (CategoryEmbeddings.embedding <=> "NewsEmbedding".embedding) <= .60
    WHERE "News"."createdAt" < ${cursor}
    GROUP BY
      "News".link,
      "Source".code
    ORDER BY "News"."createdAt" DESC
    LIMIT ${limit};`;

  return result.map((news) => ({
    ...news,
    // eslint-disable-next-line eqeqeq
    lastRow: news.rowNum == 1
  }));
};
