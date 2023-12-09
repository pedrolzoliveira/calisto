import { Scraper } from '../scraper';
import { getHTML } from '../utils/get-html';

export const valorScraper = new Scraper({
  sourceCode: 'valor',
  getLinks: async () => {
    const html = await getHTML('https://valor.globo.com/ultimas-noticias');

    return html.querySelectorAll('.feed-post-body').reduce<string[]>((arr, post) => {
      const link = post.querySelector('a')?.getAttribute('href');

      if (link) {
        arr.push(link);
      }

      return arr;
    }, []);
  },
  getContent: html => [
    html.querySelector('.content-head__title')?.text.trim(),
    html.querySelector('.content-head__subtitle')?.text.trim(),
    html.querySelectorAll('p.content-text__container').map(({ text }) => text.trim()).filter(Boolean).join('\n')
  ].filter(Boolean).join('\n')
});
