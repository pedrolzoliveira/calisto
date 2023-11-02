import { html } from 'lit'
import { map } from 'lit/directives/map.js'

interface ProfileSelectProps {
  profileId: string
  profiles: Array<{
    id: string
    name: string
  }>
}

export function profilesSelect({ profileId, profiles }: ProfileSelectProps) {
  return html`
    <div class="flex justify-center items-center px-2 space-x-2">
      <label for="select-profiles">Perfil: </label>
      <select name="profileId" id="select-profiles" class="p-2 border rounded" hx-get="/news/feed" hx-trigger="change" hx-swap="innerHTML" hx-target="main">
        ${map(profiles, profile => html`<option value="${profile.id}" ?selected=${profile.id === profileId}>${profile.name}</option>`)}
      </select>
    </div>`
}
