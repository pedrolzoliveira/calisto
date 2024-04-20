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
}

export function header(props?: HeaderProps) {
  return html`
    <header class="h-12 px-2 bg-white sticky top-0 border-b flex justify-between items-center">
      <div class="lg:flex-1 flex justify-start">
        <img class="h-8" src="/assets/logo.svg" alt="logo"/>
      </div>
      ${
        props?.profilesData
        ? profilesSelect(props.profilesData)
        : nothing
      }
      <div class="flex space-x-2 sm:flex-1 justify-end">
        <a href="/news" class="hidden sm:flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 rounded">
          <span class="material-symbols-outlined">newspaper</span>
          <p class="text-sm">Notícias</p>
        </a>
        <a href="/profiles" class="hidden sm:flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 rounded">
          <span class="material-symbols-outlined">manage_accounts</span>
          <p class="text-sm">Gerenciar Perfis</p>
        </a>
        <a href="/users/sign-out" class="hidden sm:flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 rounded">
          <span class="material-symbols-outlined">logout</span>
          <p class="text-sm">Sair</p>
        </a>
        <div class="relative sm:hidden">
            <button id="menu-btn" class="flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 rounded sm:hidden">
              <span class="material-symbols-outlined">menu</span>
            </button>
            <dialog id="menu-dialog" class="bg-white rounded shadow absolute right-0 m-0 sm:hidden -translate-x-[65%] w-44">
              <a href="/news" class="flex items-center space-x-2 hover:bg-gray-50 px-4 py-3 rounded">
                <span class="material-symbols-outlined">newspaper</span>
                <p class="text-sm">Notícias</p>
              </a>
              <a href="/profiles" class="flex items-center space-x-2 hover:bg-gray-50 px-4 py-3 rounded">
                <span class="material-symbols-outlined">manage_accounts</span>
                <p class="text-sm">Gerenciar Perfis</p>
              </a>
              <a href="/users/sign-out" class="flex items-center space-x-2 hover:bg-gray-50 px-4 py-3 rounded">
                <span class="material-symbols-outlined">logout</span>
                <p class="text-sm">Sair</p>
              </a>
            </dialog>
          </div>
      </div>
    </header>
    <script>
      const menuBtn = document.getElementById('menu-btn');
      const menuDialog = document.getElementById('menu-dialog');
      
      if (menuBtn && !menuBtn.hasAttribute('data-event-click-attached')) {
        menuBtn.addEventListener('click', (event) => {
          const wasOpen = menuDialog.open;
          menuDialog.show();

          if (!wasOpen) {
            event.stopPropagation();
          }
        });
        menuBtn.setAttribute('data-event-click-attached', '');
      }

      if (!document.body.hasAttribute('data-event-click-attached-close-menu')) {
        document.body.addEventListener('click', (event) => {
          if (!menuDialog.open) return;

          menuDialog.close();
        });
        document.body.setAttribute('data-event-click-attached-close-menu', '');
      }
    </script>`;
}
