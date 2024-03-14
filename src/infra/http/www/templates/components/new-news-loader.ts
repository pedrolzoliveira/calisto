import { html } from '@lit-labs/ssr';
import { newsCard, type NewsCardProps } from './news-card';

interface newNewsLoaderProps {
  profileId: string
  cursor: Date
  news?: Array<NewsCardProps>
}

export function newNewsLoader({ profileId, cursor, news }: newNewsLoaderProps) {
  return html`
    <div class="hidden" hx-swap="outerHTML" hx-trigger="every 15s" hx-get="/news/load-new?profileId=${profileId}&cursor=${cursor.toISOString()}"></div>
    ${news?.map(newsCard)}
  `;
}
