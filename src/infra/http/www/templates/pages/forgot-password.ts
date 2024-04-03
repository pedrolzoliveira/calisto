import { html } from '@lit-labs/ssr';
import { inputClass } from '../styles/input';
import { button } from '../components/button';

export function forgotPassword() {
  return html`
    <main class="flex justify-center items-center p-4 h-screen">
      <form hx-post="/users/forgot-password" class="flex flex-col space-y-4 w-96">
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
        ${button({ type: 'submit', content: 'Enviar Email Para Redefinir Senha' })}
      </form>
    </main>
  `;
}
