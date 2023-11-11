import { html } from 'lit'
import { when } from 'lit/directives/when.js'
import { newsCard, type NewsCardProps } from './news-card'

export interface NewsFeedProps {
  news: NewsCardProps[]
  profileId: string
}

export function newsFeed({ news, profileId }: NewsFeedProps) {
  if (!news.length) {
    return []
  }

  const lastNews = news[news.length - 1]
  return [
    ...news.map(newsCard),
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
  ]
}
