import { html } from '@lit-labs/ssr'
import { signUpForm } from '../forms/sign-up'

export function signUpPage() {
  return html`
    <main class="flex justify-center items-center p-4 h-screen">
      ${signUpForm()}
    </main>
  `
}
