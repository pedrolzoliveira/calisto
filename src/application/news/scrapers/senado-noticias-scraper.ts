import { Scraper } from '../scraper';
import { getHTML } from '../utils/get-html';

export const senadoNoticiasScraper = new Scraper({
  sourceCode: 'senado-noticias',
  blackList: ['https://www12.senado.leg.br/noticias/videos/'],
  getLinks: async () => {
    const html = await getHTML('https://www12.senado.leg.br/noticias/ultimas');

    return html.querySelectorAll('.lista-resultados > li a').map(element => `https://www12.senado.leg.br${element.getAttribute('href') as string}`);
  },
  getContent: html => {
    return [
      html.querySelectorAll('.container-infomateria p').map(({ text }) => text),
      html.querySelectorAll('#materia h1, #textoMateria p').map(({ text }) => text)
    ].filter(Boolean).join('\n');
  }
});
