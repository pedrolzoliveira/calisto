import { html } from '@lit-labs/ssr'
import { input } from '../components/input'
import { button } from '../components/button'

export function signInPage() {
  return html`
    <main class="flex justify-center items-center p-4 h-screen">
      <form method="post" action="/users/sign-in" class="flex flex-col space-y-4 w-96">
        <h1 class="font-bold text-lg">Logar</h1>
        <div class="flex flex-col">
          <label for="email">Email</label>
          ${input({ id: 'email', type: 'email', name: 'email' })}
        </div>
        <div class="flex flex-col">
          <label for="password">Senha</label>
          ${input({ id: 'password', type: 'password', name: 'password' })}
        </div>
        ${button({ type: 'submit', content: 'Entrar' })}
        <p class="text-sm w-full">Não tem conta ainda? <a class="text-blue-600 italic hover:underline" href="/users/sign-up">Inscreva-se</a></p>
      </form>
    </main>
  `
}
