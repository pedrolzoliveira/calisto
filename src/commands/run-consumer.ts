import { logger } from '../infra/logger';
import { emailsQueue } from '../application/emails/queues/emails';
import { subscriber } from '../infra/database/subscriber';
import { newsCreatedQueue } from '../application/news/queues/news-created';
import { calculateCategoriesEmbeddingsQueue } from '../application/profiles/queues/calculate-categories-embeddings';

const QUEUES = {
  emails: emailsQueue,
  'news-created': newsCreatedQueue,
  'calculate-categories-embeddings': calculateCategoriesEmbeddingsQueue
} as const;

async function runAll() {
  logger.info('Starting all consumers');
  Object.values(QUEUES).map(async (queue) => await queue.consume());
}

async function runConsumer(args: string[]) {
  await subscriber.connect();

  if (args.includes('--all')) {
    return await runAll();
  }

  const queueName = args[2];
  if (!queueName) {
    throw new Error('Queue name not provided. available queues: ' + Object.keys(QUEUES).join(', '));
  }
  const queue = QUEUES[queueName as keyof typeof QUEUES];
  if (!queue) {
    throw new Error(`Consumer "${queueName}" not found. available consumers: ${Object.keys(QUEUES).join(', ')}`);
  }

  logger.info(`Starting ${queueName} consumer`);
  await queue.consume();
}

runConsumer(process.argv);
