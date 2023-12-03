import { Publisher } from '../infra/messaging/rabbitmq/publisher'
import { processingRelationsQueue } from './chat-gpt/queues/processing-relations'
import { newsCreatedQueue } from './news/queues/news-created'

export const publisher = new Publisher({
  queues: [
    newsCreatedQueue,
    processingRelationsQueue
  ]
})
