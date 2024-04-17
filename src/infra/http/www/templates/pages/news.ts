import { html } from '@lit-labs/ssr';
import { newsLoader } from '../components/news-loader';
import { DateTime } from 'luxon';

interface NewsPageProps {
  profileId: string
}

export function newsPage({ profileId }: NewsPageProps) {
  return html`
    <main class="space-y-4 flex justify-center items-center flex-col py-4"> 
      ${newsLoader({
         addPulling: true,
         addLazyLoading: true,
         profileId,
         limit: 20,
         cursorUpper: new Date(),
         cursorLower: DateTime.now().minus({ days: 3 }).toJSDate()
      })}
    </main>
  `;
}
