import { z } from 'zod';

export const authRequestSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const emailSchema = z.string().email('Email invalido');

export const passwordRecoveryRequestSchema = z.object({
  token: z.string(),
  password: z.string()
});
