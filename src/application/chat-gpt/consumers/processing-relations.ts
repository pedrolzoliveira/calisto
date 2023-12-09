import { prismaClient } from '@/src/infra/database/prisma/client'
import { processingRelationsQueue } from '../queues/processing-relations'
import { relateCategories } from '../use-cases/relate-categories'
import { logger } from '@/src/infra/logger'
import { Consumer } from '@/src/infra/messaging/rabbitmq/consumer'
import { publisher } from '../../publisher'

export const processingRelationsConsumer = new Consumer({
  queue: processingRelationsQueue,
  fn: async ({ link }) => {
    logger.info(`processing-relations consumer: ${link}`)
    await prismaClient.$transaction(async (transaction) => {
      try {
        const [data] = await transaction.$queryRaw<{ batchId: string, content: string, categories: string[] }[]>`
          WITH Batch AS (
              INSERT INTO "ProcessBatch" ("id", "newsLink", "createdAt")
              VALUES (gen_random_uuid(), ${link}, now())
              RETURNING "id"
          ),
          ProcessedCategories AS (
              UPDATE "NewsCategory"
              SET "processed" = true, "batchId" = Batch."id"
              FROM Batch
              WHERE "NewsCategory"."id" IN (
                  SELECT
                    "id"
                  FROM
                    "NewsCategory"
                  WHERE "newsLink" = ${link}
                    AND "processed" = false
                  LIMIT 20
                )
              RETURNING "NewsCategory"."category", "NewsCategory"."newsLink", Batch."id" AS "batchId"
          )
          SELECT
              "News"."content",
              ProcessedCategories."batchId",
              array_agg(ProcessedCategories."category") AS categories
          FROM "News"
          JOIN ProcessedCategories ON ProcessedCategories."newsLink" = "News"."link"
          GROUP BY "News"."content", ProcessedCategories."batchId";`

        if (!data) {
          return
        }

        const { batchId, content, categories } = data

        const relatedCategories = await relateCategories({
          batchId,
          content,
          categories,
          transaction
        })

        const [unprocessedCategories] = await Promise.all([
          transaction.newsCategory.count({
            where: {
              newsLink: link,
              processed: false
            }
          }),
          relatedCategories && transaction.newsCategory.updateMany({
            data: { related: true },
            where: {
              processed: true,
              newsLink: link,
              category: { in: relatedCategories }
            }
          })
        ])

        if (unprocessedCategories > 0) {
          publisher.publish('processing-relations', { link })
        }
      } catch (error) {
        logger.error(error)
        throw error
      }
    }, {
      maxWait: 5000,
      timeout: 10000
    })
  }
})
