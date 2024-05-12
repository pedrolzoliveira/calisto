import { html } from '@lit-labs/ssr';
import { editProfileForm } from '../../../../../application/profiles/forms/edit-profile';
interface EditProfilePageProps {
  profile: {
    id: string
    name: string
    categories: string[]
  }
}

export function editProfilePage({ profile }: EditProfilePageProps) {
  return html`
    <main class="flex justify-center p-4">
      ${editProfileForm.render({ data: profile })}
    </main>`;
}
