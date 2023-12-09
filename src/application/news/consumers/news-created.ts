import { logger } from '@/src/infra/logger';
import { populateNewsCategory } from '../queries/populate-news-category';
import { newsCreatedQueue } from '../queues/news-created';
import { publisher } from '../../publisher';
import { Consumer } from '@/src/infra/messaging/rabbitmq/consumer';

export const newsCreatedConsumer = new Consumer({
  queue: newsCreatedQueue,
  fn: async ({ link }) => {
    logger.info(`news-created consumer: ${link}`);
    await populateNewsCategory(link);
    publisher.publish('processing-relations', { link });
  }
});
