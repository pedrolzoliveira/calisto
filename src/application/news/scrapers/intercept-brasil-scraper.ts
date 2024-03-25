import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space';
import { Scraper } from '../scraper';
import { getHTML } from '../utils/get-html';

export const interceptBrasilScraper = new Scraper({
  sourceCode: 'intercept-brasil',
  getLinks: async () => {
    const html = await getHTML('https://www.intercept.com.br/news-sitemap.xml');

    return html.querySelectorAll('url > loc').map(({ text }) => text);
  },
  getContent: html => {
    return sanitizeWhiteSpace(
      [
        html.querySelectorAll('section.single-header h1.content-title, section.single-header p.content-excert').map(({ text }) => text),
        html.querySelectorAll('div.single-content > p').map(({ text }) => text)
      ].filter(Boolean).join('\n')
    );
  }
});
