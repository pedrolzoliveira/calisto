import { html } from '@lit-labs/ssr';
import { map } from 'lit/directives/map.js';
import { DateTime } from 'luxon';

interface ProfileSelectProps {
  profileId: string
  profiles: Array<{
    id: string
    name: string
  }>
}

export function profilesSelect({ profileId, profiles }: ProfileSelectProps) {
  const searchParams = new URLSearchParams({
    limit: '20',
    cursorUpper: new Date().toISOString(),
    cursorLower: DateTime.now().minus({ days: 3 }).toJSDate().toISOString(),
    addPulling: 'true',
    addLazyLoading: 'true'
  });

  return html`
    <script>
      function setSpinnerInMain() {
        const main = document.querySelector('main');
        if (main) {
          main.innerHTML = '<div></div><span id="spinner" class="material-symbols-outlined animate-spin">progress_activity</span>';
        }
      }
    </script>
    <div class="flex justify-center items-center px-2 space-x-2 flex-1">
      <label class="text-sm hidden sm:block" for="select-profiles">Perfil: </label>
      <select onchange="setSpinnerInMain()" name="profileId" id="select-profiles" class="w-full max-w-96 p-2 border rounded" hx-get="/news/fetch?${searchParams.toString()}" hx-trigger="change" hx-swap="innerHTML" hx-target="main">
        ${map(profiles, profile => html`<option value="${profile.id}" ?selected=${profile.id === profileId}>${profile.name}</option>`)}
      </select>
    </div>
    `;
}
