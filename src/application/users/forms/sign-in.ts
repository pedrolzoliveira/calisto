import { Form, field } from '@/src/infra/http/www/form';
import { html } from '@lit-labs/ssr';
import { z } from 'zod';
import { inputClass } from '@/src/infra/http/www/templates/styles/input';
import { buttonClass } from '@/src/infra/http/www/templates/styles/button';
import { signIn } from '../use-cases/sign-in';

export const signInForm = new Form({
  route: '/users/sign-in-form',
  schema: () => z.object({
    email: z.string().email(),
    password: z.string()
  }),
  action: async ({ req, res, data }) => {
    req.session.user = await signIn(data);
    res.setHeader('HX-Redirect', '/news').end();
  },
  render: ({ actionError, route }) => html`
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
      <h1 class="font-bold text-lg">Logar</h1>
      ${
        field({
          name: 'email',
          initialValue: '',
          render: ({ value, endpoint }) => html`
          <div hx-indicator="this" hx-target="this" hx-swap="outerHTML" class="flex flex-col">
            <label for="email">Email</label>
            <input
              class=${inputClass}
              id="email"
              name="email"
              type="email"
              required
              value=${value}
              hx-post=${endpoint}
            />
          </div>`
        })
      }
      ${
        field({
          name: 'password',
          initialValue: '',
          render: ({ value, endpoint }) => html`
          <div hx-indicator="this" hx-target="this" hx-swap="outerHTML" class="flex flex-col">
            <label for="password">Senha</label>
            <input
              class=${inputClass}
              id="password"
              name="password"
              type="password"
              required
              value=${value}
              hx-post=${endpoint}
            />
          </div>`
        })
      }
      ${actionError && html`<p class="text-red-600 italic">${actionError}</p>`}
      <button id="submit-button" type="submit" class="${buttonClass}">
        <p>Entrar</p>
        <span class="material-symbols-outlined animate-spin">progress_activity</span>
      </button>
      <p class="text-sm w-full">
        Não tem conta ainda?
        <a class="text-blue-600 italic hover:underline" href="/users/sign-up">Inscreva-se</a>
      </p>
      <p class="text-sm w-full">
        Esqueceu a senha?
        <a class="text-blue-600 italic hover:underline" href="/users/forgot-password">Redefinir senha</a>
      </p>
    </form>
  `
});
