import { z } from 'zod'
import { Queue } from '@/src/infra/messaging/rabbitmq/queue'

export const newsCreatedSchema = z.object({
  link: z.string(),
  content: z.string()
})

export const newsCreatedQueue = new Queue({
  name: 'news-created',
  schema: newsCreatedSchema
})
