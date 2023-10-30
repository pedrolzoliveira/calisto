import { html } from 'lit'

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
        <input-list name="categories[]" required></input-list>
      </div>
      <div class="flex justify-end space-x-2">
        <a href="/profiles" class="px-2 py-1 border rounded bg-gray-600 hover:bg-gray-500 text-white">Voltar</a>
        <button type="submit" class="px-2 py-1 border rounded bg-blue-700 hover:bg-blue-600 text-white">Criar</button>
      </div>
      </form>
    </main>`
}
