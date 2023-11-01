import { logger } from '@/src/infra/logger'
import { populateNewsCategory } from '../queries/populate-news-category'
import { newsCreatedQueue } from '../queues/news-created'
import { processingRelationsQueue } from '../../chat-gpt/queues/processing-relations'

newsCreatedQueue.consume(async ({ link }) => {
  logger.info(`news-created consumer: ${link}`)
  await populateNewsCategory(link)
  await processingRelationsQueue.send({ link })
})
