import { z } from 'zod';

export const getNewsRequestSchema = z.object({
  profileId: z.string().uuid()
});

export const fetchNewsRequestSchema = z.object({
  profileId: z.string().uuid(),
  limit: z.number({ coerce: true }).default(50),
  addPulling: z.boolean({ coerce: true }).default(false),
  addLazyLoading: z.boolean({ coerce: true }).default(false),
  cursorUpper: z.date({ coerce: true }).default(new Date()),
  cursorLower: z.date({ coerce: true }).default(new Date(0))
});
