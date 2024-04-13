import { html } from '@lit-labs/ssr';
import { inputClass } from '../styles/input';
import { button } from '../components/button';

export function forgotPassword() {
  return html`
    <main class="flex justify-center items-center p-4 h-screen">
      <form hx-post="/users/forgot-password" class="flex flex-col space-y-4 w-full sm:w-96">
        <img class="pb-12" src="/assets/logo.svg" alt="logo"/>
        <h1 class="font-bold text-lg">Redefinir senha</h1>
        <div class="flex flex-col">
          <label for="email">Email</label>
          <input
            class=${inputClass}
            id="email"
            name="email"
            type="email"
            required
          />
        </div>
        ${button({ type: 'submit', content: 'Enviar email para redefinir senha' })}
      </form>
    </main>
  `;
}
