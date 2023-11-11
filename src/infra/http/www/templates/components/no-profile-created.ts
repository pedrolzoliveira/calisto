import { html } from 'lit'

export function noProfileCreated() {
  return html`
    <p class="text-center">Crie um perfil para ver as notícias!</p>
    <p class="text-center">Clique em <a href="/profiles/new">Gerenciar Perfis</a> para criar um perfil.</p>
  `
}
