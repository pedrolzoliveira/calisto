import { logger } from '@/src/infra/logger'
import { createNews } from '../../../use-cases/create-news'
import { relateCategories } from '../../../use-cases/relate-categories'
import { getHTML } from '../../../utils/get-html'
import { getOpenGraphMetadata } from '../../../utils/get-open-graph-metadata'
import { isNewsCreated } from '../../../utils/is-news-created'
import { getValorContent } from './get-content'

export const createValorNews = async (link: string) => {
  logger.info('createValorNews')
  if (await isNewsCreated(link)) {
    return null
  }

  const html = await getHTML(link)

  const ogMetadata = getOpenGraphMetadata(html)
  const content = getValorContent(html)

  const news = await createNews({ sourceCode: 'valor', link, content, ...ogMetadata })

  await relateCategories(news)

  return news
}
