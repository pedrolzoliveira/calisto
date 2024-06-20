import { Form, field } from '@/src/infra/http/www/form';
import { html } from '@lit-labs/ssr';
import { z } from 'zod';
import { inputClass } from '@/src/infra/http/www/templates/styles/input';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { signUp } from '../use-cases/sign-up';
import { createExampleProfile } from '../../profiles/use-cases/create-example-profile';
import { buttonClass } from '@/src/infra/http/www/templates/styles/button';

export const signUpForm = new Form({
  route: '/users/sign-up-form',
  schema: () => z.object({
    email: z
      .string()
      .email()
      .refine(async (email) => {
        return !await prismaClient.user.count({
          where: { email }
        });
      }, { message: 'Email já cadastrado' }),
    password: z.string()
  }),
  action: async ({ req, res, data }) => {
    const user = await signUp(data);
    req.session.user = user;
    res.setHeader('HX-Redirect', '/news').end();

    try {
      await createExampleProfile(user.id);
    } catch {}
  },
  render: ({ route, actionError }) => html`
    <form hx-post="${route}" class="flex flex-col space-y-4 w-full sm:w-96" hx-indicator="#submit-button" hx-swap="outerHTML">
      <style>
        .htmx-request#submit-button p {
          display: none;
        }
        #submit-button span {
          display: none;
        }
        .htmx-request#submit-button span {
          display: block;
        }
      </style>
      <img class="pb-12" src="/assets/logo.svg" alt="logo"/>
      <h1 class="font-bold text-lg">Criar conta</h1>
      ${
        field({
          name: 'email',
          initialValue: '',
          render: ({ value, endpoint, errors }) => html`
          <div hx-indicator="this" hx-target="this" hx-swap="outerHTML" class="flex flex-col">
            <label for="email">Email</label>
            <input
              class=${inputClass}
              id="email"
              name="email"
              type="email"
              required
              value=${value}
              hx-post="${endpoint}"
            />
            ${errors?.map(error => html`<p class="text-red-500 text-xs">${error}</p>`)}
          </div>
          `
        })
      }
      ${
        field({
          name: 'password',
          initialValue: '',
          render: ({ value }) => html`
          <div hx-indicator="this" hx-target="this" hx-swap="outerHTML" class="flex flex-col">
            <label for="password">Senha</label>
            <input
              class=${inputClass}
              id="password"
              name="password"
              type="password"
              required
              minlength="8"
              value=${value}
            />
          </div>
          `
        })
      }
      ${
        field({
          name: 'confirm_password',
          initialValue: '',
          render: ({ value }) => html`
          <div hx-indicator="this" hx-target="this" hx-swap="outerHTML" class="flex flex-col">
            <label for="confirm_password">Confirmar Senha</label>
            <input
              class=${inputClass}
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              value=${value}
            />
          </div>
          `
        })
      }
      <div class="flex space-x-2">
        ${field({
          name: 'terms',
          initialValue: false,
          render: ({ value, name }) => html`<input hx-indicator="this" name=${name} type="checkbox" ?checked=${value} required/>`
        })}
        <p class="text-sm">
          Eu li e concordo com a
          <a href="https://www.iubenda.com/privacy-policy/25194377/cookie-policy" class="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe " title="Política de Cookies ">Política de Cookies</a><script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script>
          e a
          <a href="https://www.iubenda.com/privacy-policy/25194377" class="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe " title="Política de Privacidade ">Política de Privacidade</a><script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script>
        </p>
      </div>
      ${actionError && html`<p class="text-red-600 italic">${actionError}</p>`}
      <button id="submit-button" class="${buttonClass}">
        <p>Criar conta</p>
        <span class="material-symbols-outlined animate-spin">progress_activity</span>
      </button>
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
  `
});
