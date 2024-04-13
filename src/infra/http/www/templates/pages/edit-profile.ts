import { html } from '@lit-labs/ssr';
import { button } from '../components/button';
interface EditProfilePageProps {
  profile: {
    id: string
    name: string
    categories: string[]
  }
}

export function editProfilePage({ profile }: EditProfilePageProps) {
  return html`
    <main class="flex justify-center p-4">
      <form class="space-y-2 w-full sm:w-96" hx-put="/profiles" hx-push-url="true" hx-swap="outerHTML">
        <h1 class="font-semibold text-lg">Editar perfil</h1>
        <input type="text" name="id" value="${profile.id}" hidden>
        <div class="flex flex-col">
          <label for="name">Nome: </label>
          <input
            name="name"
            id="name"
            type="text"
            class="px-2 py-1 rounded border"
            value="${profile.name}"
            required
            maxlength="32">
        </div>
        <div class="flex flex-col">
          <label for="categories">Categorias:</label>
          <input-list maxLength=${20} inputMaxLength=${32} name="categories[]" value=${JSON.stringify(profile.categories)} required></input-list>
        </div>
        <div class="flex justify-end space-x-2">
          <a href="/profiles">
            ${button({ className: 'bg-gray-600 hover:bg-gray-500', content: 'Voltar' })}
          </a>
          <button type="submit">
            ${button({ content: 'Salvar' })}
          </button>
        </div>
      </form>
    </main>`;
}
