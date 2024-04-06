import { z } from 'zod';

export const getNewsRequestSchema = z.object({
  profileId: z.string().uuid(),
  limit: z.number({ coerce: true }).default(20),
  cursor: z.date({ coerce: true }).default(new Date())
});
