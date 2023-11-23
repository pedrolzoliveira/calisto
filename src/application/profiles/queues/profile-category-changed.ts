import { Queue } from '@/src/infra/messaging/rabbitmq/queue'
import { z } from 'zod'

export const profileCategoryChangedSchema = z.object({
  profileId: z.string()
})

export const profileCategoryChangedQueue = new Queue({
  name: 'profile-category-changed',
  schema: profileCategoryChangedSchema
})
