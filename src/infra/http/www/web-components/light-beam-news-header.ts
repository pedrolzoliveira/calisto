import { LitElement, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';

@customElement('light-beam-news-header')
export class LightBeamNewsHeader extends LitElement {
  createRenderRoot() {
    return this;
  }

  @query('#menu-dialog')
    menu!: HTMLDialogElement;

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('click', this.handleCloseDialog.bind(this));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleCloseDialog.bind(this));
  }

  handleOpenMenu(event: MouseEvent) {
    const wasOpen = this.menu.open;
    this.menu.show();

    if (!wasOpen) {
      event.stopPropagation();
    }
  }

  handleCloseDialog() {
    if (!this.menu.open) return;

    this.menu.close();
  }

  render() {
    return html`
      <header class="h-12 px-2 bg-white sticky top-0 border-b flex justify-between items-center">
        <div class="lg:flex-1 flex justify-start">
          <img class="h-8" src="/assets/logo.svg" alt="logo"/>
        </div>
        <div class="flex justify-center items-center px-2 space-x-2 flex-1">
          <label class="text-sm hidden sm:block" for="select-profiles">Perfil:</label>
          <select name="profileId" id="select-profiles" class="w-full max-w-96 p-2 border rounded" hx-trigger="change" hx-swap="innerHTML" hx-target="main">
          </select>
        </div>
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
            <button id="menu-btn" @click=${this.handleOpenMenu} class="flex items-center space-x-2 hover:bg-gray-50 px-4 py-2 rounded sm:hidden">
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
    `;
  }
}
