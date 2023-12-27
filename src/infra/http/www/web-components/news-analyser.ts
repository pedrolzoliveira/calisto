import '@lit-labs/ssr-client/lit-element-hydrate-support.js';

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

interface Batch {
  id: string
  request: any
  response: any
  error: any
  categories: {
    category: string
    related: boolean
  }[]
}

export interface NewsAnalyserProps {
  batches: Batch[]
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
}

const formatter = new Intl.DateTimeFormat('default', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric'
});

@customElement('news-analyser')
export class NewsAnalyser extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ type: Object })
    data!: NewsAnalyserProps;

  renderObject({ title, data }: { title: string, data: any | null }) {
    const stringified = JSON.stringify(data, null, 2);

    function handleClick() {
      navigator.clipboard.writeText(stringified);
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
      `;
  }

  renderMessagesToCopy(batch: Batch) {
    try {
      const messages: Array<{ role: 'system' | 'assistant' | 'user', content: string }> = [
        ...batch.request?.messages,
        ...batch.response?.choices.map(({ message }: any) => message)
      ];

      return html`
      <details>
        <summary class="flex justify-between border-b p-4">
          <p class="cursor-pointer">Mensagens para copiar</p>
        </summary>
        ${
          messages.map(({ role, content }) => html`
            <p class="p-4">${role}</p>
            <div class="p-4 bg-gray-50 border relative">
              <button @click=${() => { navigator.clipboard.writeText(content); }} class="absolute top-4 right-4">
                <span class="material-symbols-outlined">content_copy</span>
              </button>
              <pre class="whitespace-pre-wrap"><code>${content}</code></pre>
            </div>
          `)
        }
      </details>
    `;
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { news } = this.data;
    const { source } = news;

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
        <div class="w-1/2 border rounded bg-white h-[90vh] overflow-y-scroll">
          ${
            repeat(
              this.data.batches,
              ({ id }) => id,
              batch => html`
                <div class="flex flex-col p-4 border-b">
                  <p class="px-4 text-gray-600 text-sm">BatchId: ${batch.id}</p>
                  <details open>
                    <summary class="flex justify-between border-b p-4">
                      <p class="cursor-pointer">Categorias</p>
                    </summary>
                    <div class="flex w-full justify-between p-4">
                      <div>
                        <h2 class="font-bold">Categorias analisadas</h2>
                        <ul>
                          ${batch.categories.map(({ category }) => html`<li>${category}</li>`)}
                        </ul>
                      </div>
                      <div>
                        <h2 class="font-bold">Categorias relacionadas</h2>
                        <ul>
                          ${batch.categories.filter(({ related }) => related).map(({ category }) => html`<li>${category}</li>`)}
                        </ul>
                      </div>
                    </div>
                  </details>
                  ${
                    this.renderObject({
                      title: 'Request',
                      data: batch.request
                    })
                  }
                  ${
                    this.renderObject({
                      title: 'Response',
                      data: batch.response
                    })
                  }
                  ${this.renderMessagesToCopy(batch)}
                  ${
                    this.renderObject({
                      title: 'Error',
                      data: batch.error
                    })
                  }
                </div>
              `
            )
          }
        </div>
      </div>
    `;
  }
}
