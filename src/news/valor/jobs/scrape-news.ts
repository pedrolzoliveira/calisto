import { createValorNews } from '../use-cases/create-news'
import { getValorLastNewsLinks } from '../use-cases/get-last-news-links'

export const scrapeValorNews = async () => {
  const links = await getValorLastNewsLinks()
  links.forEach(createValorNews)
}
