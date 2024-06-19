import { signUpForm } from '@/src/application/users/forms/sign-up';
import { html } from '@lit-labs/ssr';

export function signUpPage() {
  return html`
    <main class="flex justify-center items-center p-4 h-screen">
      ${signUpForm.render()}
    </main>
  `;
}
