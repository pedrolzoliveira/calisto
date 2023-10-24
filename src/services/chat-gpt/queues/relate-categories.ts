import { z } from 'zod'
import { Queue } from '@/src/infra/messaging/rabbitmq/queue'

export const relateCategoriesSchema = z.object({
  link: z.string(),
  content: z.string(),
  categories: z.string().array()
})

export const relateCategoriesQueue = new Queue({
  name: 'relate-categories',
  schema: relateCategoriesSchema
})
