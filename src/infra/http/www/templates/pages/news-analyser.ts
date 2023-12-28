import { html } from '@lit-labs/ssr';
import { type NewsAnalyserProps } from '../../web-components/news-analyser';

export function newsAnalyserPage(data: NewsAnalyserProps) {
  return html`<news-analyser data=${JSON.stringify(data)}></news-analyser>`;
}
