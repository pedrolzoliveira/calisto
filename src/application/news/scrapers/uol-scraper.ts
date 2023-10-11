import { Scraper } from '../scraper'
import { getHTML } from '../utils/get-html'

export const uolScraper = new Scraper({
  sourceCode: 'uol',
  blackList: [
    'noticias.uol.com.br',
    'congressoemfoco.uol.com.br',
    'operamundi.uol.com.br',
    'redetv.uol.com.br',
    'cultura.uol.com.br',
    'tnonline.uol.com.br',
    'band.uol.com',
    'bandnewstv.band.uol.com.br',
    'guia.folha.uol.com.br'
  ],
  getLinks: async () => {
    const html = await getHTML('https://noticias.uol.com.br/ultimas')

    return html.querySelectorAll('.results-items a').reduce<string[]>((arr, linkElement) => {
      const link = linkElement.getAttribute('href')

      if (link) {
        arr.push(link)
      }

      return arr
    }, [])
  },
  getContent: (html) => [
    html.querySelector('.c-content-head__title')?.text.trim(),
    html.querySelector('.c-content-head__subtitle')?.text.trim(),
    html.querySelectorAll('div.c-news__body > p').map(({ text }) => text.trim()).filter(Boolean).join('\n')
  ].filter(Boolean).join('\n')
})
