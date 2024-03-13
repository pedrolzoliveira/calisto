import { Queue } from '@/src/infra/messaging/rabbitmq/queue';
import { z } from 'zod';

export const calculateCategoriesEmbeddingsSchema = z.object({
  categories: z.string().array()
});

export const calculateCategoriesEmbeddingsQueue = new Queue({
  name: 'calculate-categories-embeddings',
  schema: calculateCategoriesEmbeddingsSchema
});
