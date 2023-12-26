import { html } from '@lit-labs/ssr';
import { profilesSelect } from './components/profiles-select';

export interface HeaderProps {
  profiles: Array<{
    id: string
    name: string
  }>
  profileId: string
}

export function header(props?: HeaderProps) {
  return html`
    <header class="h-12 px-2 bg-white sticky top-0 border-b flex justify-between items-center">
      <div class="flex-1 flex justify-start">
        <img class="h-8" src="/assets/logo.svg" alt="logo"/>
      </div>
      ${props ? profilesSelect(props) : null}
      <div class="flex space-x-2 flex-1 justify-end">
        <a href="/news" class="flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 rounded">
          <span class="material-symbols-outlined">newspaper</span>
          <p class="text-sm">Notícias</p>
        </a>
        <a href="/profiles" class="flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 rounded">
          <span class="material-symbols-outlined">manage_accounts</span>
          <p class="text-sm">Gerenciar Perfis</p>
        </a>
        <a href="/users/sign-out" class="flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 rounded">
          <span class="material-symbols-outlined">logout</span>
          <p class="text-sm">Sair</p>
        </a>
      </div>
    </header>`;
}
