import { html } from '@lit-labs/ssr';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inputClass } from '../styles/input';
import { button } from '../components/button';

const email = (value?: string, error?: string) => {
  return html`
    <div class="flex flex-col">
      <label for="email">Email</label>
      <input
        class=${inputClass}
        id="email"
        name="email"
        type="email"
        required
        value=${ifDefined(value)}
      />
    </div>
  `;
};

const password = (value?: string) => {
  return html`
    <div class="flex flex-col">
      <label for="password">Senha</label>
      <input
        class=${inputClass}
        id="password"
        name="password"
        type="password"
        required
        value=${ifDefined(value)}
      />
    </div>
  `;
};

interface SignInFormProps {
  error?: string
  email: {
    value?: string
  }
  password: {
    value?: string
  }
}

export const signInForm = (data?: SignInFormProps) => {
  return html`
    <form hx-post="/users/sign-in" hx-swap="outerHTML" class="flex flex-col space-y-4 w-96">
      <h1 class="font-bold text-lg">Logar</h1>
      ${email(data?.email.value)}
      ${password(data?.password.value)}
      ${data?.error && html`<p class="text-red-600 italic">${data.error}</p>`}
      ${button({ type: 'submit', content: 'Entrar' })}
      <p class="text-sm w-full">
        Não tem conta ainda?
        <a class="text-blue-600 italic hover:underline" href="/users/sign-up">Inscreva-se</a>
      </p>
    </form>
  `;
};

signInForm.email = email;
signInForm.password = password;
