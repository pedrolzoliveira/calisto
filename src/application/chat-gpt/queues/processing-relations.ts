import { Queue } from '@/src/infra/messaging/rabbitmq/queue';
import { z } from 'zod';

export const processingRelationsSchema = z.object({
  link: z.string()
});

export const processingRelationsQueue = new Queue({
  name: 'processing-relations',
  schema: processingRelationsSchema
});
