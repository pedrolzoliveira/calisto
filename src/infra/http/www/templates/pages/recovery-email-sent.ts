import { html } from '@lit-labs/ssr';

export function recoveryEmailSent() {
  return html`
    <img class="pb-12" src="/assets/logo.svg" alt="logo"/>
    <p>Se o Email fornecido estiver cadastrado, você receberá um email em breve com as instruções para redefinir a senha.</p>
  `;
}
