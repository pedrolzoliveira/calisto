import { html } from '@lit-labs/ssr';
import { newProfileForm } from '../../../../../application/profiles/forms/new-profile';

export function newProfilePage() {
  return html`
    <main class="flex justify-center p-4">
      ${newProfileForm.render()}
    </main>`;
}
