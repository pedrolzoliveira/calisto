import { html } from '@lit-labs/ssr'
import { input } from '../components/input'
import { button } from '../components/button'

export function signUpPage() {
  return html`
    <main class="flex justify-center items-center p-4 h-screen">
      <form method="post" action="/users/sign-up" class="flex flex-col space-y-4 w-96">
        <h1 class="font-bold text-lg">Criar conta</h1>
        <div class="flex flex-col">
          <label for="email">Email</label>
          ${input({ id: 'email', type: 'email', name: 'email', required: true })}
        </div>
        <div class="flex flex-col">
          <label for="password">Senha</label>
          ${input({ id: 'password', type: 'password', name: 'password', required: true, minlength: 8 })}
        </div>
        <div class="flex flex-col">
          <label for="confirm_password">Confirmar Senha</label>
          ${input({ id: 'confirm_password', type: 'password', required: true })}
        </div>
        ${button({ type: 'submit', content: 'Criar conta' })}
        <p class="text-sm w-full">Já tem uma conta? <a class="text-blue-600 italic hover:underline" href="/users/sign-in">Entrar</a></p>
      </form>
    </main>
    <script>
      confirm_password.addEventListener('input', () => {
        if (confirm_password.value !== password.value) {
          confirm_password.setCustomValidity('Senhas não conferem')
        } else {
          confirm_password.setCustomValidity('')
        }
      })
    </script>
  `
}
