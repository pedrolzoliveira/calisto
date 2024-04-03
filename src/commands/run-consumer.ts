import { logger } from '../infra/logger';
import { newsCreatedConsumer } from '@/src/application/news/consumers/news-created';
import { createConnection } from '../infra/messaging/rabbitmq/create-connection';
import { createChannel } from '../infra/messaging/rabbitmq/create-channel';
import { publisher } from '../application/publisher';
import { newsCreatedQueue } from '../application/news/queues/news-created';
import { calculateCategoriesEmbeddingsQueue } from '../application/profiles/queues/calculate-categories-embeddings';
import { calculateCategoriesEmbeddingsConsumer } from '../application/profiles/consumers/calculate-categories-embeddings';
import { type Channel } from 'amqplib';
import { emailsQueue } from '../application/emails/queues/emails';
import { emailsConsumer } from '../application/emails/consumers/emails';

const QUEUES = {
  'news-created': {
    queue: newsCreatedQueue,
    consumer: newsCreatedConsumer
  },
  'calculate-categories-embeddings': {
    queue: calculateCategoriesEmbeddingsQueue,
    consumer: calculateCategoriesEmbeddingsConsumer
  },
  emails: {
    queue: emailsQueue,
    consumer: emailsConsumer
  }
} as const;

async function runAll(channel: Channel) {
  logger.info('Starting all consumers');

  for (const { consumer, queue } of Object.values(QUEUES)) {
    queue.bindChannel(channel);
    await queue.assertQueue();

    consumer.bindChannel(channel);
  }

  Object.values(QUEUES).map(async ({ consumer }) => await consumer.consume());
}

async function runConsumer(args: string[]) {
  const connection = await createConnection();
  const channel = await createChannel(connection);
  publisher.bindChannel(channel);

  if (args.includes('--all')) {
    return await runAll(channel);
  }

  const queueName = args[2];
  if (!queueName) {
    throw new Error('Queue name not provided. available queues: ' + Object.keys(QUEUES).join(', '));
  }
  const { consumer, queue } = QUEUES[queueName as keyof typeof QUEUES];
  if (!consumer || !queue) {
    throw new Error(`Consumer "${queueName}" not found. available consumers: ${Object.keys(QUEUES).join(', ')}`);
  }

  logger.info(`Starting ${queueName} consumer`);

  queue.bindChannel(channel);
  await queue.assertQueue();

  consumer.bindChannel(channel);
  await consumer.consume();
}

runConsumer(process.argv);
