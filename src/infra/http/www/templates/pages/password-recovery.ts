import { html } from '@lit-labs/ssr';
import { passwordRecoveryForm } from '../forms/password-recovery';

export function passwordRecoveryPage(token: string) {
  return html`
    <main class="flex justify-center items-center p-4 h-screen">
      ${passwordRecoveryForm(token)}
    </main>
  `;
}
