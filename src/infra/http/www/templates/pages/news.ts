import { html } from '@lit-labs/ssr';
import { newsLoader } from '../components/news-loader';
interface NewsPageProps {
  profileId: string
}

export function newsPage({ profileId }: NewsPageProps) {
  return html`
    <main class="space-y-4 flex justify-center items-center flex-col py-4"> 
      ${newsLoader({ addPulling: true, addLazyLoading: true, profileId, limit: 5, cursorUpper: new Date(), cursorLower: new Date(0) })}
    </main>
  `;
}
