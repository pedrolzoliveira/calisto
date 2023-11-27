import { z } from 'zod'

export const env = z.object({
  CORS_ORIGIN: z.string(),
  CHAT_GPT_ORGANIZATION_ID: z.string(),
  CHAT_GPT_KEY: z.string(),
  RABBIT_MQ_URL: z.string(),
  PORT: z.number().default(8080),
  SESSION_SECRET: z.string()
}).parse(process.env)
