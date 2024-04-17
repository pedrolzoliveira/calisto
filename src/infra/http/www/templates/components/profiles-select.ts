import { html } from '@lit-labs/ssr';
import { map } from 'lit/directives/map.js';

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
    cursorLower: new Date(0).toISOString(),
    addPulling: 'true',
    addLazyLoading: 'true'
  });

  return html`
    <div class="flex justify-center items-center px-2 space-x-2 flex-1">
      <label class="text-sm" for="select-profiles">Perfil: </label>
      <select name="profileId" id="select-profiles" class="p-2 border rounded" hx-get="/news/fetch?${searchParams.toString()}" hx-trigger="change" hx-swap="innerHTML" hx-target="main">
        ${map(profiles, profile => html`<option value="${profile.id}" ?selected=${profile.id === profileId}>${profile.name}</option>`)}
      </select>
    </div>`;
}
