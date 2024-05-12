import { html } from '@lit-labs/ssr';
import { profilesSelect } from './components/profiles-select';
import { nothing } from 'lit';
import { buttonClass } from './styles/button';
import { twMerge } from 'tailwind-merge';

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
        <button onclick="openConfirmLogoutDialog()" class="hidden sm:flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 rounded">
          <span class="material-symbols-outlined">logout</span>
          <p class="text-sm">Sair</p>
        </button>
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
              <button onclick="openConfirmLogoutDialog()" class="flex items-center space-x-2 hover:bg-gray-50 px-4 py-3 rounded w-full">
                <span class="material-symbols-outlined">logout</span>
                <p class="text-sm">Sair</p>
              </button>
            </dialog>
          </div>
      </div>
      <dialog id="confirm-logout" class="rounded" onclick="handleClickOutsideConfirmLogoutDialog(event)">
        <div class="p-4 sm:max-w-96 space-y-4">
          <h1 class="text-lg font-bold">Você tem certeza que deseja sair?</h1>
          <div class="flex justify-end space-x-2">
            <button type="button" class=${twMerge(buttonClass, 'bg-gray-600 hover:bg-gray-500')} onclick="closeConfirmLogoutDialog()">Cancelar</button>
            <a
              class=${twMerge(buttonClass, 'bg-red-700 hover:bg-red-600 w-20 text-center')}
              href="/users/sign-out"
            >Sair</a>
          </div>
        </div>
      </dialog>
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

      function openConfirmLogoutDialog() {
        const dialog = document.querySelector('#confirm-logout');
        dialog.showModal();
      }

      function closeConfirmLogoutDialog() {
        const dialog = document.querySelector('#confirm-logout');
        dialog.close();
      }

      function handleClickOutsideConfirmLogoutDialog(event) {
        const dialog = document.querySelector('#confirm-logout');
        if (event.target === dialog) {
          event.preventDefault();
          closeConfirmLogoutDialog();
        }
      }

    </script>`;
}
