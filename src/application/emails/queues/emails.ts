import { Queue } from '@/src/infra/messaging/rabbitmq/queue';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email(),
  content: z.string(),
  subject: z.string()
});

export const emailQueue = new Queue({
  name: 'email',
  schema: emailSchema
});
