import { html } from '@lit-labs/ssr';
import { type NewsCardAnalyserProps, newsCardAnalyserFeed } from '../components/news-card-analyser-feed';

interface NewsAnalyserFeedPageProps {
  news: NewsCardAnalyserProps[]
}
export function newsAnalyserFeedPage({ news }: NewsAnalyserFeedPageProps) {
  return html`
    <main class="flex flex-col items-center space-y-8 p-8">
      ${news.map(newsCardAnalyserFeed)}
    </main>
  `;
}
