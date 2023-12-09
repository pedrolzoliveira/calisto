import { Scraper } from '../scraper';
import { getHTML } from '../utils/get-html';

export const estadaoScraper = new Scraper({
  sourceCode: 'estadao',
  getLinks: async () => {
    const html = await getHTML('https://www.estadao.com.br/noticias-ultimas');

    return html.querySelectorAll('.noticias-mais-recenter--item').reduce<string[]>((arr, post) => {
      const link = post.querySelector('a')?.getAttribute('href');

      if (link) {
        arr.push(link);
      }

      return arr;
    }, []);
  },
  getContent: html => [
    html.querySelector('h1')?.text.trim(),
    html.querySelector('h2')?.text.trim(),
    html.querySelectorAll('.styles__ParagraphStyled-rhi54a-0').map(({ text }) => text.trim()).filter(Boolean).join('\n')
  ].filter(Boolean).join('\n')
});
