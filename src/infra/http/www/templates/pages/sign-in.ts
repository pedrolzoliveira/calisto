import { signInForm } from '@/src/application/users/forms/sign-in';
import { html } from '@lit-labs/ssr';

export function signInPage() {
  return html`
    <main class="flex justify-center items-center p-4 h-screen">
      ${signInForm.render()}
    </main>
  `;
}
