import { getHTML } from '../../utils/get-html'

export const getFolhaLastNewsLinks = async () => {
  const links = []
  const html = await getHTML('https://www1.folha.uol.com.br/news-sitemap.xml')

  for (let i = 0; i < 20; i++) {
    const link = html.querySelectorAll('url > loc')[i].text
    links.push(link)
  }

  return links
}
