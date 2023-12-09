import { prismaClient } from '@/src/infra/database/prisma/client';
import { profileCategoryChangedQueue } from '../queues/profile-category-changed';
import { processingRelationsQueue } from '../../chat-gpt/queues/processing-relations';

export const profileCategoryChangedConsumer = profileCategoryChangedQueue.createConsumer(async ({ profileId }) => {
  await prismaClient.$transaction(async tx => {
    const newsLinks = await tx.$queryRaw<{ newsLink: string }[]>`
      WITH
        LastNews AS (
          SELECT
            "link"
          FROM
            "News"
          ORDER BY
            "createdAt" DESC
          LIMIT
            20
        ),
        InsertedData AS (
          INSERT INTO
            "NewsCategory" ("category", "newsLink", "related", "processed")
          SELECT DISTINCT
            "ProfileCategory"."category",
            LastNews."link",
            false,
            false
          FROM
            "ProfileCategory",
            LastNews
          WHERE
            "ProfileCategory"."profileId" = ${profileId}
          ON CONFLICT
          DO
            NOTHING
          RETURNING
            "newsLink"
        )
      SELECT DISTINCT
        "newsLink"
      FROM
        InsertedData;
    `.then(data => data.map(({ newsLink }) => newsLink));

    await Promise.all(
      newsLinks.map(async link => await processingRelationsQueue.send({ link }))
    );
  });
});
