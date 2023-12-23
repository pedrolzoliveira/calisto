import { html } from '@lit-labs/ssr';
import { when } from 'lit/directives/when.js';
import { newsCard, type NewsCardProps } from './news-card';

export interface NewsFeedProps {
  isAdmin?: boolean
  news: NewsCardProps[]
  profileId: string
}

export function newsFeed({ isAdmin, news, profileId }: NewsFeedProps) {
  if (!news.length) {
    return [];
  }

  const lastNews = news[news.length - 1];
  return [
    ...news.map(news => newsCard({ ...news, isAdmin })),
    ...when(
      !lastNews.lastRow,
      () => [
        html`
          <div hx-swap="outerHTML" hx-trigger="revealed" hx-get="/news/feed?profileId=${profileId}&cursor=${lastNews.createdAt.toISOString()}">
            <span id="spinner" class="material-symbols-outlined animate-spin">progress_activity</span>
          </div>`
      ],
      () => []
    )
  ];
}
