import { Scraper } from '../scraper';
import { getHTML } from '../utils/get-html';

export const g1Scraper = new Scraper({
  sourceCode: 'g1',
  blackList: ['globoplay.globo.com', 'g1.globo.com/jornal-da-globo'],
  getLinks: async () => {
    const html = await getHTML('https://g1.globo.com/ultimas-noticias');

    return html.querySelectorAll('.feed-post-body').reduce<string[]>((arr, post) => {
      const link = post.querySelector('a')?.getAttribute('href');

      if (link) {
        arr.push(link);
      }

      return arr;
    }, []);
  },
  getContent: html => [
    html.querySelector('.content-head')?.text.trim(),
    html.querySelector('.content-head__subtitle')?.text.trim(),
    html.querySelectorAll('.content-text__container').map(({ text }) => text.trim()).filter(Boolean).join('\n')
  ].filter(Boolean).join('\n')
});
