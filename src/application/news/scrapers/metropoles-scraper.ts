import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space';
import { Scraper } from '../scraper';
import { getHTML } from '../utils/get-html';

export const metropolesScraper = new Scraper({
  sourceCode: 'metropoles',
  getLinks: async () => {
    const html = await getHTML('https://www.metropoles.com/ultimas-noticias');

    return html.querySelectorAll('h5.noticia__titulo > a').map(element => element.getAttribute('href')) as string[];
  },
  getContent: html => {
    return sanitizeWhiteSpace(
      [
        html.querySelector('h1.Text__TextBase-sc-1d75gww-0.kReYKa')?.text,
        html.querySelector('h2.Text__TextBase-sc-1d75gww-0.braIGx.noticiaCabecalho__subtitulo')?.text,
        html.querySelectorAll('.ConteudoNoticiaWrapper__Artigo-sc-19fsm27-1.bKozcf > p, .ConteudoNoticiaWrapper__Artigo-sc-19fsm27-1.bKozcf > h4').map(({ text }) => text)
      ].filter(Boolean).join('\n')
    );
  }
});
