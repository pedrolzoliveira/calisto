import { logger } from '../infra/logger'
import { processingRelationsConsumer } from '@/src/application/chat-gpt/consumers/processing-relations'
import { newsCreatedConsumer } from '@/src/application/news/consumers/news-created'
import { profileCategoryChangedConsumer } from '@/src/application/profiles/consumers/profile-category-changed'

(async () => {
  const queueName = process.argv[2]
  const queues = ['processing-relations', 'news-created', 'profile-category-changed']

  if (!queueName) {
    throw new Error('Queue name not provided. available queues: ' + queues.join(', '))
  }
  switch (queueName) {
    case 'processing-relations':
      logger.info('Starting processing-relations consumer')
      await processingRelationsConsumer.run()
      break
    case 'news-created':
      logger.info('Starting news-created consumer')
      await newsCreatedConsumer.run()
      break
    case 'profile-category-changed':
      logger.info('Starting profile-category-changed consumer')
      await profileCategoryChangedConsumer.run()
      break
    default:
      throw new Error(`Queue "${queueName}" not found. available queues: ${queues.join(', ')}`)
  }
})()
