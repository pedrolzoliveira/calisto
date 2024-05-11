import { z } from 'zod';
import { Form, field } from '../../../infra/http/www/form';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { profilesTable } from '../../../infra/http/www/templates/tables/profiles';
import { html } from '@lit-labs/ssr';
import { button } from '../../../infra/http/www/templates/components/button';
import { updateProfile } from '@/src/application/profiles/use-cases/update-profile';

export const editProfileForm = new Form({
  route: '/profiles/edit-profile-form',
  schema: (req) => z.object({
    id: z.string().uuid(),
    name: z.string().refine(async (name) => {
      const nameAlreadyBeingUsed = !await prismaClient.profile.count({
        where: {
          id: { not: req.body.id },
          userId: req.session.user!.id,
          name
        }
      });

      return nameAlreadyBeingUsed;
    }, { message: 'Nome já utilizado' }),
    categories: z.array(z.string().min(1).max(32)).min(1).max(20)
  }),
  action: async ({ req, res, data }) => {
    const belongsToUser = Boolean(
      await prismaClient.profile.findFirst({
        select: { id: true },
        where: { id: data.id, userId: req.session.user!.id }
      })
    );

    if (belongsToUser) {
      await updateProfile(data);
    }

    const profiles = await prismaClient.profile.findMany({
      select: {
        id: true,
        name: true,
        categories: true
      },
      orderBy: { createdAt: 'asc' },
      where: { userId: req.session.user!.id }
    });

    return res.setHeader('HX-Push-Url', '/profiles').renderTemplate(
      profilesTable({ profiles })
    );
  },
  render: ({ route }) => html`
    <form class="space-y-2 w-full sm:w-96" hx-put="${route}" hx-swap="outerHTML">
      <h1 class="font-semibold text-lg">Editar perfil</h1>
      ${field({ name: 'id', initialValue: '', render: ({ name, value }) => html`<input name=${name} value=${value} class="hidden">` })}
      ${
        field({
          name: 'name',
          initialValue: '',
          render: ({ value, name, endpoint, errors }) => html`
            <div hx-target="this" hx-swap="outerHTML" class="flex flex-col">
              <label for="name">Nome: </label>
              <input
                id="name"
                name="${name}"
                type="text"
                class="px-2 py-1 rounded border"
                required
                hx-put=${endpoint}
                value=${value}
                maxlength="32">
                ${errors?.map(error => html`<p class="text-red-500 text-xs">${error}</p>`)}
            </div>
          `
        })
      }
      ${
        field({
          name: 'categories',
          initialValue: [],
          render: ({ value, name }) => html`
            <div class="flex flex-col">
              <label for="categories">Categorias:</label>
              <input-list maxLength=${20} inputMaxLength=${32} name="${name}[]" value=${JSON.stringify(value)} required></input-list>
            </div>
          `
        })
      }
      <div class="flex justify-end space-x-2">
        <a href="/profiles">${button({ type: 'button', content: 'Voltar', className: 'bg-gray-600 hover:bg-gray-500' })}</a>
        ${button({ type: 'submit', content: 'Salvar' })}
      </div>
    </form>
  `
});
