import { html } from '@lit-labs/ssr';
import { button } from '../components/button';

export interface ProfilesTableProps {
  profiles: Array<{
    id: string
    name: string
    categories: string[]
  }>
}

export function profilesTable({ profiles }: ProfilesTableProps) {
  return html`
    <div class="w-full rounded space-y-4 max-w-[100vw]" id="profiles-table">
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
                            <a
                              hx-delete="?id=${profile.id}"
                              hx-push-url="false"
                              hx-target="#profiles-table"
                              hx-swap="outerHTML"
                              class="font-medium text-red-600 hover:underline hover:cursor-pointer">Deletar</a>
                        </td>
                    </tr> 
                  `)
                }
            </tbody>
        </table>
    </div>`;
}
