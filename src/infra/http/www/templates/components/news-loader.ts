import { html } from '@lit-labs/ssr';
import { nothing } from 'lit';

interface NewsLoaderProps {
  profileId: string
  limit: number
  addPulling?: boolean
  addLazyLoading?: boolean
  cursorUpper: Date
  cursorLower: Date
  hideLoader?: boolean
  hxTrigger?: 'load' | 'revealed' | 'every 15s'
}

export function newsLoader({
  hideLoader,
  hxTrigger = 'load',
  addPulling,
  addLazyLoading,
  profileId,
  limit,
  cursorUpper,
  cursorLower
}: NewsLoaderProps) {
  const searchParams = new URLSearchParams({
    profileId,
    limit: String(limit),
    cursorUpper: cursorUpper.toISOString(),
    cursorLower: cursorLower.toISOString(),
    ...(addPulling && { addPulling: 'true' }),
    ...(addLazyLoading && { addLazyLoading: 'true' })
  });

  return html`
    <div
      id="news-loader"
      hx-get="/news/fetch?${searchParams.toString()}"
      hx-trigger="${hxTrigger}"
      hx-swap="outerHTML"
    >
      ${
         hideLoader
         ? nothing
         : html`
          <span
            id="spinner"
            class="material-symbols-outlined animate-spin"
          >progress_activity</span>
         `
      }
    </div>
  `;
}
