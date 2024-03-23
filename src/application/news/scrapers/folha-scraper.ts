import { Scraper } from '../scraper';
import { getHTML } from '../utils/get-html';

export const folhaScraper = new Scraper({
  sourceCode: 'folha',
  getLinks: async () => {
    const html = await getHTML('https://www1.folha.uol.com.br/news-sitemap.xml');

    return Array.from(
      html.querySelectorAll('url > loc')
    ).slice(0, 20).map(({ text }) => text);
  },
  getContent: html => [
    html.querySelector('.c-content-head__title')?.text.trim(),
    html.querySelector('.c-content-head__subtitle')?.text.trim(),
    html.querySelectorAll('div.c-news__body > p').map(({ text }) => text.trim()).filter(Boolean).join('\n')
  ].filter(Boolean).join('\n')

});
