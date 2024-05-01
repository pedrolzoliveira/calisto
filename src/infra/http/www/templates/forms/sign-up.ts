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
    <form hx-post="/users/sign-up" hx-swap="outerHTML" class="flex flex-col space-y-4 w-full sm:w-96">
      <img class="pb-12" src="/assets/logo.svg" alt="logo"/>
      <h1 class="font-bold text-lg">Criar conta</h1>
      ${email(data?.email.value, data?.email.error)}
      ${password(data?.password.value)}
      ${confirmPassword(data?.confirmPassword.value)}
      <div class="flex space-x-2">
        <input type="checkbox" required/>
        <p class="text-sm">
          Eu li e concordo com a
          <a href="https://www.iubenda.com/privacy-policy/25194377/cookie-policy" class="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe " title="Política de Cookies ">Política de Cookies</a><script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script>
          e a
          <a href="https://www.iubenda.com/privacy-policy/25194377" class="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe " title="Política de Privacidade ">Política de Privacidade</a><script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script>
        </p>
      </div>
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
signUpForm.termsOfUserAndPrivacyPolicy = termsOfUserAndPrivacyPolicy;
