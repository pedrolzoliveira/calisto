import { html } from 'lit'
import { type ProfilesTableProps, profilesTable } from '../tables/profiles'

interface ProfilesPageProps {
  profiles: ProfilesTableProps['profiles']
}

export function profilesPage({ profiles }: ProfilesPageProps) {
  return html`
    <main class="flex justify-center p-4">
      ${profilesTable({ profiles })}
    </main>`
}
