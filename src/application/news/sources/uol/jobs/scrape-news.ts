import { createUolNews } from '../use-cases/create-news'
import { getUolLastNewsLinks } from '../use-cases/get-last-news-links'

export const scrapeUolNews = async () => {
  const links = await getUolLastNewsLinks()
  links.forEach(createUolNews)
}
