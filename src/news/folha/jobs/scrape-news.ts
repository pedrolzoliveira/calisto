import { createFolhaNews } from '../use-cases/create-news'
import { getFolhaLastNewsLinks } from '../use-cases/get-last-news-links'

export const scrapeFolhaNews = async () => {
  const links = await getFolhaLastNewsLinks()
  links.forEach(createFolhaNews)
}
