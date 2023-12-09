import { html } from '@lit-labs/ssr';
import { inputClass } from '../styles/input';
import { button } from '../components/button';
import { ifDefined } from 'lit/directives/if-defined.js';

const email = (value?: string, error?: string) => {
  return html`
    <div hx-target="this" hx-swap="outerHTML" class="flex flex-col">
      <label for="email">Email</label>
      <input
        class=${inputClass}
        id="email"
        name="email"
        type="email"
        required
        value=${ifDefined(value)}
        data-error=${ifDefined(error)}
        hx-post="/users/sign-up/email"
      />
      ${error && html`<script>email.setCustomValidity(email.getAttribute('data-error'))</script>`}
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
        minlength="8"
        value=${ifDefined(value)}
      />
    </div>
  `;
};

const confirmPassword = (value?: string) => {
  return html`
     <div class="flex flex-col">
      <label for="confirm_password">Confirmar Senha</label>
      <input
        class=${inputClass}
        id="confirm_password"
        name="confirm_password"
        type="password"
        required
        value=${ifDefined(value)}
      />
    </div>
  `;
};

interface SignUpFormProps {
  error?: string
  email: {
    value: string
    error?: string
  }
  password: {
    value: string
  }
  confirmPassword: {
    value: string
  }
}

export const signUpForm = (data?: SignUpFormProps) => {
  return html`
    <form hx-post="/users/sign-up" hx-swap="outerHTML" class="flex flex-col space-y-4 w-96">
      <h1 class="font-bold text-lg">Criar conta</h1>
      ${email(data?.email.value, data?.email.error)}
      ${password(data?.password.value)}
      ${confirmPassword(data?.confirmPassword.value)}
      ${data?.error && html`<p class="text-red-600 italic">${data.error}</p>`}
      ${button({ type: 'submit', content: 'Criar conta' })}
      <p class="text-sm w-full">
        Já tem uma conta?
        <a class="text-blue-600 italic hover:underline" href="/users/sign-in">Entrar</a>
      </p>

      <script>
        function checkPasswordsMatch() {
          if (confirm_password.value !== password.value) {
            return confirm_password.setCustomValidity('As senhas não conferem')
          } 
          
          return confirm_password.setCustomValidity('')
        }

        password.addEventListener('input', checkPasswordsMatch)
        confirm_password.addEventListener('input', checkPasswordsMatch)
      </script>
    </form>
  `;
};

signUpForm.email = email;
signUpForm.password = password;
signUpForm.confirmPassword = confirmPassword;
