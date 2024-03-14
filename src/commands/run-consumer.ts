import { logger } from '../infra/logger';
import { newsCreatedConsumer } from '@/src/application/news/consumers/news-created';
import { createConnection } from '../infra/messaging/rabbitmq/create-connection';
import { createChannel } from '../infra/messaging/rabbitmq/create-channel';
import { publisher } from '../application/publisher';
import { newsCreatedQueue } from '../application/news/queues/news-created';
import { calculateCategoriesEmbeddingsQueue } from '../application/profiles/queues/calculate-categories-embeddings';
import { calculateCategoriesEmbeddingsConsumer } from '../application/profiles/consumers/calculate-categories-embeddings';

createConnection().then((connection) => {
  createChannel(connection).then(async channel => {
    const queueName = process.argv[2];
    const queues = ['news-created', 'calculate-categories-embeddings'];

    publisher.bindChannel(channel);

    if (!queueName) {
      throw new Error('Queue name not provided. available queues: ' + queues.join(', '));
    }
    switch (queueName) {
      case 'news-created':
        logger.info('Starting news-created consumer');

        newsCreatedQueue.bindChannel(channel);
        await newsCreatedQueue.assertQueue();

        newsCreatedConsumer.bindChannel(channel);
        await newsCreatedConsumer.consume();
        break;
      case 'calculate-categories-embeddings':
        logger.info('Starting calculate-categories-embeddings consumer');

        calculateCategoriesEmbeddingsQueue.bindChannel(channel);
        await calculateCategoriesEmbeddingsQueue.assertQueue();

        calculateCategoriesEmbeddingsConsumer.bindChannel(channel);
        await calculateCategoriesEmbeddingsConsumer.consume();
        break;
      default:
        throw new Error(`Queue "${queueName}" not found. available queues: ${queues.join(', ')}`);
    }
  });
});
