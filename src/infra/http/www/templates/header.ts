import { html } from '@lit-labs/ssr'
import { profilesSelect } from './components/profiles-select'

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
      <div class="space-x-2 flex items-center">
        <a href="/news">Notícias</a>
        <a href="/profiles">Gerenciar Perfis</a>
        ${props ? profilesSelect(props) : null}
      </div>
      <a href="/users/sign-out">Sair</a>
    </header>`
}
