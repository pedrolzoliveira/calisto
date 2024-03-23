import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space';
import { Scraper } from '../scraper';
import { getHTML } from '../utils/get-html';

export const infoMoneyScraper = new Scraper({
  sourceCode: 'info-money',
  getLinks: async () => {
    const html = await getHTML('https://www.infomoney.com.br/news-sitemap.xml');

    return Array.from(
      html.querySelectorAll('td > a') as unknown as HTMLAnchorElement[]
    ).slice(0, 50).map(({ href }) => href);
  },
  getContent: html => {
    return sanitizeWhiteSpace(
      [
        html.querySelector('[data-ds-component="article-title"]')?.text,
        html.querySelectorAll('[data-ds-component="article"] > p, [data-ds-component="article"] > h2').map(({ text }) => text)
      ].filter(Boolean).join('\n')
    );
  }
});
