import { Publisher } from '../infra/messaging/rabbitmq/publisher';
import { newsCreatedQueue } from './news/queues/news-created';
import { calculateCategoriesEmbeddingsQueue } from './profiles/queues/calculate-categories-embeddings';

export const publisher = new Publisher({
  queues: [
    newsCreatedQueue,
    calculateCategoriesEmbeddingsQueue
  ]
});
