import { html } from 'lit'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

export type GenericJson = Record<string, JsonValue>

interface BatchAnalyserProps {
  id: string
  request: GenericJson | null
  response: GenericJson | null
  error: GenericJson | null
  news: {
    link: string
    title: string
    description: string | null
    content: string
    imageUrl: string | null
    createdAt: Date
    source: {
      name: string
      avatarUrl: string | null
    }
  }
  categories: {
    category: string
    related: boolean
  }[]
}

const formatter = new Intl.DateTimeFormat('default', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric'
})

export const batchAnalyser = (batch: BatchAnalyserProps) => {
  const { news, categories } = batch
  const { source } = news

  return html`
    <div class="flex p-4 space-x-4">
      <div class="flex flex-col w-1/2 border rounded bg-white max-h-[90vh] overflow-y-scroll">
        <div class="p-4 flex border-b justify-between">
            <img src="${source.avatarUrl ?? ''}" alt="news source image" class="rounded-full w-10 h-10">
            <div class="flex-1 flex flex-col px-4">
                <div class="flex space-x-2 items-center">
                    <h1 class="font-semibold">${source.name}</h1>
                    <p>·</p>
                    <p class="text-sm text-gray-700">${formatter.format(news.createdAt)}</p>
                </div>
            </div>
        </div>
        <div class="p-4 space-y-2">
          <details>
            <summary>Imagem</summary>
              ${
                news.imageUrl
                ? html`
                    <div>
                      <img src="${news.imageUrl}" alt="news thumbnail">
                    </div>`
                : null
              }
            </details>
            <h1 class="text-lg font-semibold">${news.title}</h1>
            <p class="text-xs text-gray-700">${news.description}</p>
            <details open>
              <div class="text-sm">${news.content}</div>
            </details>
        </div>
      </div>
      <div class="flex flex-col w-1/2 border rounded bg-white h-[90vh] overflow-y-scroll">
        <div>
          <h2>Categorias analisadas</h2>
          <ul>
            ${categories.map(({ category }) => html`<li>${category}</li>`)}
          </ul>
        </div>
        <div>
          <h2>Categorias relacionadas</h2>
          <ul>
            ${categories.filter(({ related }) => related).map(({ category }) => html`<li>${category}</li>`)}
          </ul>
        </div>
      </div>
    </div>
  `
}
