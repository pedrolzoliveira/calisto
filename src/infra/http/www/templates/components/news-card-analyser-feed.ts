import { html } from '@lit-labs/ssr';
import { type NewsCategory, type Source } from '@prisma/client';
import { nothing } from 'lit';

export interface NewsCardAnalyserProps {
  link: string
  title: string
  description: string | null
  content: string
  imageUrl: string | null
  source: Source
  categories: NewsCategory[]
}

export function newsCardAnalyserFeed({
  source,
  categories,
  ...news
}: NewsCardAnalyserProps) {
  return html`
     <div class="flex flex-col w-1/2 border rounded bg-white max-h-[90vh] overflow-y-scroll">
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
                      <a target="_blank" class="text-gray-700" href="/process-batches?newsLink=${news.link}">Analisar batches</a>
                  </div>
              </div>
              <a class="flex justify-end" href="${news.link}" target="_blank">
                <span class="material-symbols-outlined">open_in_new</span>
              </a>
          </div>
          <div class="p-4 space-y-2">
            <details open>
              <summary class="flex justify-between border-b p-4">
                <p class="cursor-pointer">Categorias</p>
              </summary>
              <div class="flex w-full justify-between p-4">
                <div>
                  <h2 class="font-bold">Categorias analisadas</h2>
                  <ul>
                    ${categories.map(({ category }) => html`<li>${category}</li>`)}
                  </ul>
                </div>
                <div>
                  <h2 class="font-bold">Categorias relacionadas</h2>
                  <ul>
                    ${categories.filter(({ related }) => related).map(({ category }) => html`<li>${category}</li>`)}
                  </ul>
                </div>
              </div>
            </details>
              ${
                news.imageUrl
                ? html`
                  <details>
                    <summary class="flex justify-between border-b p-4">
                      <p class="cursor-pointer">Imagem</p>
                    </summary>
                    <div class="flex w-full justify-between p-4">
                      <img src="${news.imageUrl}" alt="news thumbnail">
                    </div>
                  </details>    
                `
                : nothing
              }
              <details open>
                <summary class="flex justify-between border-b p-4">
                  <p class="cursor-pointer">Title and description</p>
                </summary>
                <div class="flex flex-col w-full justify-between p-4">
                  <h1 class="text-lg font-semibold">${news.title}</h1>
                  <p class="text-gray-700">${news.description}</p>
                </div>
              </details>
              <details open>
                <summary class="flex justify-between border-b p-4">
                  <p class="cursor-pointer">Content</p>
                </summary>
                <div class="flex w-full justify-between p-4">${news.content}</div>
              </details>
          </div>
        </div>
  `;
};
