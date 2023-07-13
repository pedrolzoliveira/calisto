import { createG1News } from '../use-cases/create-news'
import { getG1LastNewsLinks } from '../use-cases/get-last-news-links'

export const scrapeG1News = async () => {
  const links = await getG1LastNewsLinks()
  links.forEach(createG1News)
}
