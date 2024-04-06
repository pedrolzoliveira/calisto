import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space';
import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string().uuid(),
  name: z.string()
    .transform(sanitizeWhiteSpace)
    .refine(
      name => name.length <= 32,
      { message: 'O nome do perfil deve ter no máximo 32 caracteres.' }
    ),
  categories: z.string()
    .transform(sanitizeWhiteSpace)
    .refine(
      category => category.length <= 32,
      { message: 'Cada categoria deve ter no máximo 32 caracteres.' }
    )
    .array()
    .min(1, { message: 'O perfil deve ter ao menos uma categoria.' })
    .max(20, { message: 'O perfil deve ter no máximo 20 categorias.' })
});
