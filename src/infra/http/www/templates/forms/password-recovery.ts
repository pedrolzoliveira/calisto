import { html } from '@lit-labs/ssr';
import { inputClass } from '../styles/input';
import { button } from '../components/button';

function password() {
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
      />
    </div>
  `;
}

function confirmPassword() {
  return html`
     <div class="flex flex-col">
      <label for="confirm_password">Confirmar Senha</label>
      <input
        class=${inputClass}
        id="confirm_password"
        name="confirm_password"
        type="password"
        required
      />
    </div>
  `;
}

export function passwordRecoveryForm(token: string) {
  return html`
  <form hx-post="/users/password-recovery" hx-swap="outerHTML" class="flex flex-col space-y-4 w-96">
    <img class="pb-12" src="/assets/logo.svg" alt="logo"/>
    <h1 class="font-bold text-lg">Redefinir Senha</h1>
    ${password()}
    ${confirmPassword()}
    ${button({ type: 'submit', content: 'Redefinir senha' })}
    <input hidden name="token" value=${token} />
  </form>  
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
  `;
}
