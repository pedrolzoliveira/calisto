import { Queue } from '@/src/infra/messaging/rabbitmq/queue'
import { z } from 'zod'

export const getRelateCategoriesSchema = z.object({
  link: z.string(),
  content: z.string(),
  categories: z.string().array()
})

export const getRelatedCategories = new Queue({
  name: 'get-related-categories',
  schema: getRelateCategoriesSchema,
  consumeFunction: data => {}
})
