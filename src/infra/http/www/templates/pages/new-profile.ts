import { html } from '@lit-labs/ssr';
import { button } from '../components/button';

export function newProfilePage() {
  return html`
    <main class="flex justify-center p-4">
      <form class="space-y-2" hx-post="/profiles" hx-push-url="true">
      <h1 class="font-semibold text-lg">Crie um perfil</h1>
      <div class="flex flex-col">
        <label for="name">Nome: </label>
        <input name="name" id="name" type="text" class="px-2 py-1 rounded border" required maxlength="20">
      </div>
      <div class="flex flex-col">
        <label for="categories">Categorias:</label>
        <input-list maxLength=${20} inputMaxLength=${32} name="categories[]" required></input-list>
      </div>
      <div class="flex justify-end space-x-2">
        <a href="/profiles">${button({ type: 'button', content: 'Voltar', className: 'bg-gray-600 hover:bg-gray-500' })}</a>
        ${button({ type: 'submit', content: 'Criar' })}
      </div>
      </form>
    </main>`;
}
