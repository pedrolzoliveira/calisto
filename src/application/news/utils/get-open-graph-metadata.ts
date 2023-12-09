import { type HTMLElement } from 'node-html-parser';
import { z } from 'zod';

export const getOpenGraphMetadata = (html: HTMLElement) => {
  return z.object({
    title: z.string(),
    description: z.string().optional(),
    imageUrl: z.string().optional()
  }).parse({
    title: html.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    description: html.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    imageUrl: html.querySelector('meta[property="og:image"]')?.getAttribute('content')
  });
};
