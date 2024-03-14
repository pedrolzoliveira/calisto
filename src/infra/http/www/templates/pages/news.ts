import { html } from '@lit-labs/ssr';
import { P, match } from 'ts-pattern';
import { type NewsCardProps } from '../components/news-card';
import { newsFeed } from '../components/news-feed';
import { noNewsFound } from '../components/no-news-found';
import { noProfileCreated } from '../components/no-profile-created';
import { newNewsLoader } from '../components/new-news-loader';
import { nothing } from 'lit';

interface NewsPageProps {
  news: NewsCardProps[]
  profileId?: string | null
}

export function newsPage(props: NewsPageProps) {
  return html`
    <main class="space-y-4 flex justify-center items-center flex-col py-4">
      ${
        props.profileId
        ? newNewsLoader({
                 profileId: props.profileId,
                 cursor: props.news.at(0)?.createdAt ?? new Date()
              })
        : nothing
      }
      ${
        match(props)
          .with({ profileId: P.nullish }, noProfileCreated)
          .with({ news: [] }, noNewsFound)
          .with({ news: P.array(), profileId: P.string }, newsFeed)
          .exhaustive()
      }
    </main>
  `;
}
