import { prismaClient } from '@/src/infra/database/prisma/client';
import { profileCategoryChangedQueue } from '../queues/profile-category-changed';
import { publisher } from '../../publisher';

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
            "NewsCategory" ("id", "category", "newsLink", "related", "processed")
          SELECT DISTINCT
            gen_random_uuid(),
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

    for (const link of newsLinks) {
      publisher.publish('processing-relations', { link });
    }
  });
});
