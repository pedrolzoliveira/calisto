import { Queue } from '@/src/infra/messaging/rabbitmq/queue';
import { z } from 'zod';

const emailsSchema = z.object({
  email: z.string().email(),
  content: z.string(),
  subject: z.string()
});

export const emailsQueue = new Queue({
  name: 'emails',
  schema: emailsSchema
});
