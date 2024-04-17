import { prismaClient } from '@/src/infra/database/prisma/client';
import { type Source } from '@prisma/client';
import { UNIX_EPOCH_START_DATE } from '../constants';

interface getNewsParams {
  limit?: number
  profileId: string
  cursor?: {
    upper?: Date
    lower?: Date
  }
}

type queryResult = Array<{
  link: string
  title: string
  description: string | null
  image_url: string | null
  created_at: Date
  categories: Array<{ text: string, distance: number }>
  source: Omit<Source, 'avatarUrl'> & { avatar_url: string }
}>

export async function getNews({
  limit = Infinity,
  profileId,
  cursor
}: getNewsParams): Promise<Array<{
    link: string
    title: string
    description: string | null
    imageUrl: string | null
    createdAt: Date
    categories: Array<{ text: string, distance: number }>
    source: Source
  }>> {
  const NOW = new Date();

  const result = await prismaClient.$queryRaw<queryResult>`
    WITH categories_embeddings AS (
      SELECT
        text,
        embedding
      FROM
        category_embeddings
      WHERE
        text IN(
          SELECT UNNEST(categories)
          FROM profiles
          WHERE id = ${profileId})
    )
    SELECT
      news.link,
      news.title,
      news.description,
      news.image_url,
      news.created_at,
      json_agg(
        json_build_object(
          'text', categories_embeddings.text,
          'distance', categories_embeddings.embedding <=> news_embeddings.embedding
        )
      ) AS categories,
      row_to_json(sources) AS source
    FROM
      news
      JOIN news_embeddings ON news.link = news_embeddings.link
      JOIN sources ON sources.code = news.source_code
      JOIN categories_embeddings ON (categories_embeddings.embedding <=> news_embeddings.embedding) <= .60
    WHERE news.created_at > ${cursor?.lower ?? UNIX_EPOCH_START_DATE}::TIMESTAMP
      AND news.created_at < ${cursor?.upper ?? NOW}::TIMESTAMP
    GROUP BY
      news.link,
      sources.code
    ORDER BY news.created_at DESC
    LIMIT ${limit};`;

  return result.map(({ source, ...news }) => ({
    ...news,
    imageUrl: news.image_url,
    createdAt: news.created_at,
    source: {
      name: source.name,
      code: source.code,
      avatarUrl: source.avatar_url
    }
  }));
};
