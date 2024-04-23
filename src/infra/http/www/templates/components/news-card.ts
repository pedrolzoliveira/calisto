import { nothing } from 'lit';
import { html } from '@lit-labs/ssr';
import { type Source } from '@prisma/client';
import { asyncLocalStorage } from '../../../async-storage';

export interface NewsCardProps {
  link: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
  categories: Array<{ text: string, distance: number }>
  source: Source
  lastRow?: boolean
}

export function newsCard({ source, categories, ...news }: NewsCardProps) {
  let formatter: Intl.DateTimeFormat;

  try {
    const locale = asyncLocalStorage.getStore()?.get('locale') ?? 'default';
    const timezone = asyncLocalStorage.getStore()?.get('timezone') ?? 'default';

    formatter = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: timezone
    });
  } catch {
    formatter = new Intl.DateTimeFormat('default', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric'
    });
  }

  return html`
    <div class="flex flex-col w-[90vw] sm:w-1/3 sm:min-w-[480px] border rounded bg-white">
      <div class="p-4 flex border-b justify-between">
          ${
            source.avatarUrl
            ? html`<img src="${source.avatarUrl}" alt="news source image" class="rounded-full w-10 h-10">`
            : nothing
          }
          <div class="flex-1 flex flex-col px-4">
              <div class="flex space-x-2 items-center">
                  <h1 class="font-semibold">${source.name}</h1>
                  <p>·</p>
                  <p class="text-sm text-gray-700">${formatter.format(news.createdAt)}</p>
              </div>
              <div class="flex flex-wrap pt-1 gap-1">
                ${
                  categories.sort((a, b) => a.distance - b.distance).map(
                    ({ text, distance }) => html`
                      <p
                        class="text-xs px-2 rounded-full bg-gray-200 text-gray-700 flex justify-center items-center select-none"
                        title="Distance: ${distance}"
                      >
                        ${text}
                      </p>
                    `
                  )
                }
              </div>
          </div>
          <a class="flex justify-end" href="${news.link}" target="_blank">
              <span class="material-symbols-outlined">open_in_new</span>
          </a>
      </div>
      ${
        news.imageUrl
        ? html`<img src="${news.imageUrl}" onerror="this.classList.add('hidden')">`
        : nothing
      }
      <div class="p-4 space-y-2">
        <h1 class="text-lg font-semibold">${news.title}</h1>
        <p class="text-xs text-gray-700">${news.description}</p>
      </div>
  </div>`;
}
