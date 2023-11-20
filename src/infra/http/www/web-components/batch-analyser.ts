import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { type GenericJson } from '../../types/generic-json'
import { parseScapedJson } from '../utils/parse-scaped-json'

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
    createdAt: string
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

@customElement('batch-analyser')
export class BatchAnalyser extends LitElement {
  protected createRenderRoot(): HTMLElement | ShadowRoot {
    return this
  }

  @property({
    type: String,
    reflect: false,
    converter: value => {
      try {
        return parseScapedJson(value as string)
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Error parsing batch: ${error as any}`)
      }
    }
  })
    batch!: BatchAnalyserProps

  renderObject({ title, data }: { title: string, data: GenericJson | null }) {
    if (!data) {
      return null
    }

    const stringified = JSON.stringify(data, null, 2)

    function handleClick() {
      navigator.clipboard.writeText(stringified)
    }

    return html`
      <details>
        <summary class="flex justify-between border-b p-4">
          <p class="cursor-pointer">${title}</p>
        </summary>
        <div class="p-4 bg-gray-50 border border-t-0 relative">
        <button @click=${handleClick} class="absolute top-4 right-4">
          <span class="material-symbols-outlined">content_copy</span>
        </button>
        <pre class="whitespace-pre-wrap"><code>${stringified}</code></pre>
        </div>
      </details>
      `
  }

  render() {
    const { news, categories, request, response, error } = this.batch
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
                      <p class="text-sm text-gray-700">${
                        formatter.format(new Date(news.createdAt))
                      }</p>
                  </div>
              </div>
          </div>
          <div class="p-4 space-y-2">
              ${
                news.imageUrl
                ? html`
                  <details>
                    <summary>Imagem</summary>
                    <div>
                      <img src="${news.imageUrl}" alt="news thumbnail">
                    </div>
                  </details>    
                `
                : null
              }
              <h1 class="text-lg font-semibold">${news.title}</h1>
              <p class="text-xs text-gray-700">${news.description}</p>
              <details open>
                <div class="text-sm">${news.content}</div>
              </details>
          </div>
        </div>
        <div class="flex flex-col w-1/2 border rounded bg-white h-[90vh] overflow-y-scroll p-4">
          <details>
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
            this.renderObject({
              title: 'Request',
              data: request
            })
          }
          ${
            this.renderObject({
              title: 'Response',
              data: response
            })
          }
          ${
            this.renderObject({
              title: 'Error',
              data: error
            })
          }
        </div>
      </div>
    `
  }
}
