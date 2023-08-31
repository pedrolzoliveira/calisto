import { createEstadaoNews } from '../use-cases/create-news'
import { getEstadaoLastNewsLinks } from '../use-cases/get-last-news-links'

export const scrapeEstadaoNews = async () => {
  const links = await getEstadaoLastNewsLinks()
  links.forEach(createEstadaoNews)
}
