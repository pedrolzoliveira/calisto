import { html } from 'lit'

export function noNewsFound() {
  return html`
    <p>Nenhuma notícia por enquanto!</p>
    <p>Assim que tivermos notícias relacionadas às categorias pedidas, elas vão aparecer aqui!</p>
  `
}
