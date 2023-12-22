import { logger } from '../infra/logger';
import { processingRelationsConsumer } from '@/src/application/chat-gpt/consumers/processing-relations';
import { newsCreatedConsumer } from '@/src/application/news/consumers/news-created';
import { profileCategoryChangedConsumer } from '@/src/application/profiles/consumers/profile-category-changed';
import { createConnection } from '../infra/messaging/rabbitmq/create-connection';
import { createChannel } from '../infra/messaging/rabbitmq/create-channel';

createConnection().then((connection) => {
  createChannel(connection).then(async channel => {
    const queueName = process.argv[2];
    const queues = ['processing-relations', 'news-created', 'profile-category-changed'];

    if (!queueName) {
      throw new Error('Queue name not provided. available queues: ' + queues.join(', '));
    }
    switch (queueName) {
      case 'processing-relations':
        logger.info('Starting processing-relations consumer');
        processingRelationsConsumer.bindChannel(channel);
        await processingRelationsConsumer.consume();
        break;
      case 'news-created':
        logger.info('Starting news-created consumer');
        newsCreatedConsumer.bindChannel(channel);
        await newsCreatedConsumer.consume();
        break;
      case 'profile-category-changed':
        logger.info('Starting profile-category-changed consumer');
        profileCategoryChangedConsumer.bindChannel(channel);
        await profileCategoryChangedConsumer.consume();
        break;
      default:
        throw new Error(`Queue "${queueName}" not found. available queues: ${queues.join(', ')}`);
    }
  });
});
