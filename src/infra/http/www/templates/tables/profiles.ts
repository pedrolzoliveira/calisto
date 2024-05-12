import { html } from '@lit-labs/ssr';
import { button } from '../components/button';
import { buttonClass } from '../styles/button';
import { twMerge } from 'tailwind-merge';

export interface ProfilesTableProps {
  profiles: Array<{
    id: string
    name: string
    categories: string[]
  }>
}

export function profilesTable({ profiles }: ProfilesTableProps) {
  return html`
    <div class="w-full h-full" id="profiles-table">
      <script>
        function openDeleteProfileDialog(element) {
          const profileId = element.getAttribute('data-profile-id');
          const profileName = element.getAttribute('data-profile-name');
          
          if (!profileId) {
            throw new Error('profileId is required');
          }
  
          if (!profileName) {
            throw new Error('profileName is required');
          }
  
          const dialog = document.querySelector('#delete-profile-dialog');
          
          const profileNameElement = document.querySelector('#profile-name');
          profileNameElement.textContent = profileName;
  
          const profileIdElement = document.querySelector('#profile-id');
          profileIdElement.value = profileId;
  
          dialog.showModal();
        }
  
        function closeDialog() {
          const dialog = document.querySelector('#delete-profile-dialog');
  
          const profileNameElement = document.querySelector('#profile-name');
          profileNameElement.textContent = '';
  
          const profileIdElement = document.querySelector('#profile-id');
          profileIdElement.value = '';
  
          dialog.close();
        }
  
        function handleClickOutside(event) {
          const dialog = document.querySelector('#delete-profile-dialog');
          if (event.target === dialog) {
            event.preventDefault();
            closeDialog();
          }
        }
      </script>
      <dialog id="delete-profile-dialog" class="rounded" onclick="handleClickOutside(event)">
        <form class="p-4 sm:max-w-96" hx-delete="/profiles" hx-target="#profiles-table" hx-swap="outerHTML">
          <input type="hidden" name="id" id="profile-id">
          <h1 class="text-lg">Você tem certeza que deseja deletar o perfil <strong id="profile-name"></strong>?</h1>
          <p class="text-sm py-3">Está ação é permanente e não pode ser desfeita.</p>
          <div class="flex justify-end space-x-2">
            <button type="button" class=${twMerge(buttonClass, 'bg-gray-600 hover:bg-gray-500')} onclick="closeDialog()">Cancelar</button>
            <button
              class=${twMerge(buttonClass, 'bg-red-700 hover:bg-red-600')}
              type="submit"
            >Confirmar</button>
          </div>
        </form>
      </dialog>
      <div class="w-full rounded space-y-4 max-w-[100vw]">
        <div class="flex justify-end">
            <a href="/profiles/new">
              ${button({ type: 'button', content: 'Criar Perfil' })}  
            </a>
        </div>
        <table class="w-full text-sm text-left text-gray-500 rounded max-w-[100vw]">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 w-[20%]">
                        Nome
                    </th>
                    <th scope="col" class="px-6 py-3 w-[70%]">
                        Categorias
                    </th>
                    <th scope="col" class="px-6 py-3 w-[10%] min-w-[80px] ">
                        Ações
                    </th>
                </tr>
            </thead>
            <tbody>
                ${
                  profiles.map(profile => html`
                    <tr class="odd:bg-white even:bg-gray-50 border-b">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900">
                          ${profile.name}
                        </th>
                        <td class="px-6 py-4">
                          ${profile.categories.join(', ')}
                        </td>
                        <td class="px-6 py-4 flex flex-col items-start">
                            <a href="/profiles/edit?id=${profile.id}" class="font-medium text-blue-600 hover:underline">Editar</a>
                            <button
                              data-profile-id=${profile.id}
                              data-profile-name=${profile.name}
                              onclick="openDeleteProfileDialog(this)"
                              class="font-medium text-red-600 hover:underline hover:cursor-pointer">Deletar</button>
                        </td>
                    </tr> 
                  `)
                }
            </tbody>
        </table>
      </div>
    </div>
    `;
}
