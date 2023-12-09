import { html } from '@lit-labs/ssr';
import { signInForm } from '../forms/sign-in';

export function signInPage() {
  return html`
    <main class="flex justify-center items-center p-4 h-screen">
      ${signInForm()}
    </main>
  `;
}
