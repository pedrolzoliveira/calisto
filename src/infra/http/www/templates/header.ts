import { html } from '@lit-labs/ssr';
import { profilesSelect } from './components/profiles-select';
import { nothing } from 'lit';

export interface HeaderProps {
  profilesData?: {
    profiles: Array<{
      id: string
      name: string
    }>
    profileId: string
  }
  isAdmin?: boolean
}

export function header(props?: HeaderProps) {
  return html`
    <header class="h-12 px-2 bg-white sticky top-0 border-b flex justify-between items-center">
      <div class="flex-1 flex justify-start">
        <img class="h-8" src="/assets/logo.svg" alt="logo"/>
      </div>
      ${
        props?.profilesData
        ? profilesSelect(props.profilesData)
        : nothing
      }
      <div class="flex space-x-2 flex-1 justify-end">
        ${
          props?.isAdmin
          ? html`
            <a href="/process-batches/news-feed" class="flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 rounded">
              <span class="material-symbols-outlined">full_coverage</span>
              <p class="text-sm">Analisador de notícias</p>
            </a>
          `
          : nothing
        }
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
