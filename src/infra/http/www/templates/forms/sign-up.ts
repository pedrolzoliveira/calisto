import { html } from '@lit-labs/ssr'
import { input, inputClass } from '../components/input'
import { button } from '../components/button'
import { ifDefined } from 'lit/directives/if-defined.js'
import { twMerge } from 'tailwind-merge'

const email = (value?: string, error?: string) => {
  return html`
    <div hx-target="this" hx-swap="outerHTML" class="flex flex-col">
      <label for="email">Email</label>
      <input
        class=${twMerge(inputClass, 'data-[error]:border-red-600 after:content-[attr(data-error)]')}
        id="email"
        name="email"        
        onchange="something()"
        value=${ifDefined(value)}
        data-error=${ifDefined(error)}
        hx-post="/users/sign-up/email"
      ></input>
      <script>
        function something() {
          console.log('running something')
          email.setCustomValidity('teste')
          console.log('something runned')
        }
      </script>
    </div>
  `
}

const password = (value?: string, error?: string) => {
  return html`
    <div class="flex flex-col">
      <label for="password">Senha</label>
      ${input({ id: 'password', type: 'password', name: 'password', required: true, minlength: 8 })}
    </div>
  `
}

const confirmPassword = (value?: string, error?: string) => {
  return html`
     <div class="flex flex-col">
      <label for="confirm_password">Confirmar Senha</label>
      ${input({ id: 'confirm_password', type: 'password', required: true })}
    </div>
  `
}

export const signUpForm = () => {
  return html`
    <form method="post" action="/users/sign-up" class="flex flex-col space-y-4 w-96">
      <h1 class="font-bold text-lg">Criar conta</h1>
      ${email()}
      ${password()}
      ${confirmPassword()}
      ${button({ type: 'submit', content: 'Criar conta' })}
      <p class="text-sm w-full">Já tem uma conta? <a class="text-blue-600 italic hover:underline" href="/users/sign-in">Entrar</a></p>
    </form>
  `
}

signUpForm.email = email
signUpForm.password = password
signUpForm.confirmPassword = confirmPassword
