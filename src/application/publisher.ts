import { Publisher } from '../infra/messaging/rabbitmq/publisher';
import { emailsQueue } from './emails/queues/emails';
import { newsCreatedQueue } from './news/queues/news-created';
import { calculateCategoriesEmbeddingsQueue } from './profiles/queues/calculate-categories-embeddings';

export const publisher = new Publisher({
  queues: [
    newsCreatedQueue,
    calculateCategoriesEmbeddingsQueue,
    emailsQueue
  ]
});
