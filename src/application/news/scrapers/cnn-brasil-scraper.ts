import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space';
import { Scraper } from '../scraper';
import { getHTML } from '../utils/get-html';

export const cnnBrasilScraper = new Scraper({
  sourceCode: 'cnn-brasil',
  getLinks: async () => {
    const html = await getHTML('https://www.cnnbrasil.com.br/ultimas-noticias/');

    return html.querySelectorAll('a.home__list__tag').map(element => element.getAttribute('href')) as string[];
  },
  getContent: html => {
    return sanitizeWhiteSpace([
      html.querySelectorAll('.post__header > h1, .post__header > p').map(({ text }) => text).filter(Boolean),
      html.querySelectorAll('.post__content > p').map(({ text }) => text).filter(Boolean)
    ].filter(Boolean).join('\n'));
  }
});
