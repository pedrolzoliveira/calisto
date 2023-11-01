import { prismaClient } from '@/src/infra/database/prisma/client'
import { processingRelationsQueue } from '../queues/processing-relations'
import { relateCategories } from '../use-cases/relate-categories'
import { logger } from '@/src/infra/logger'

processingRelationsQueue.consume(async ({ link }) => {
	logger.info(`processing-relations consumer: ${link}`)
	await prismaClient.$transaction(async (tx) => {
		const [data] = await tx.$queryRaw<{ content: string; categories: string[] }[]>`
		 WITH ProcessedCategories AS (
			UPDATE "NewsCategory"
				SET "processed" = true
			WHERE "processed" = false
				AND "newsLink" = ${link}
			RETURNING "category", "newsLink"
		 )
		SELECT
			"content",
			array_agg(ProcessedCategories."category") AS categories
		FROM 	"News"
		JOIN ProcessedCategories
			ON ProcessedCategories."newsLink" = "News"."link"
		GROUP BY "News"."link";
		`

		if (!data) {
			return;
		}

		const { content, categories } = data

		const relatedCategories = await relateCategories(content, categories);

		const [unprocessedCategories] = await Promise.all([
			tx.newsCategory.count({
				where: {
					newsLink: link,
					processed: false
				}
			}),
			tx.newsCategory.updateMany({
				data: { related: true },
				where: {
					processed: true,
					newsLink: link,
					category: { in: relatedCategories }
				}
			})
		])

		if (unprocessedCategories > 0) {
			await processingRelationsQueue.send({ link })
		}
	})
})
