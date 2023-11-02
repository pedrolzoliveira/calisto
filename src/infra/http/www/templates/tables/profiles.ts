import { html } from 'lit'
import { button } from '../components/button'

export interface ProfilesTableProps {
  profiles: Array<{
    id: string
    name: string
    categories: string[]
  }>
}

export function profilesTable({ profiles }: ProfilesTableProps) {
  return html`
    <div class="rounded space-y-4" id="profiles-table">
        <div class="flex justify-end">
            <a href="/profiles/new">
              ${button({ type: 'button', content: 'Criar Perfil' })}  
            </a>
        </div>
        <table class="w-full text-sm text-left text-gray-500 rounded">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Nome
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Categorias
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Ações
                    </th>
                </tr>
            </thead>
            <tbody>
                ${
                  profiles.map(profile => html`
                    <tr class="odd:bg-white even:bg-gray-50 border-b">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          ${profile.name}
                        </th>
                        <td class="px-6 py-4">
                          ${profile.categories.join(', ')}
                        </td>
                        <td class="px-6 py-4 space-x-2">
                            <a href="/profiles/edit?id=${profile.id}" class="font-medium text-blue-600 hover:underline">Edit</a>
                            <a hx-delete="?id=${profile.id}" hx-push-url="false" hx-target="#profiles-table" class="font-medium text-red-600 hover:underline hover:cursor-pointer">Delete</a>
                        </td>
                    </tr> 
                  `)
                }
            </tbody>
        </table>
    </div>`
}
