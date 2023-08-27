import { createNews } from '../../use-cases/create-news'
import { relateCategories } from '../../use-cases/relate-categories'
import { getHTML } from '../../utils/get-html'
import { getOpenGraphMetadata } from '../../utils/get-open-graph-metadata'
import { isNewsCreated } from '../../utils/is-news-created'
import { getFolhaContent } from './get-content'

export const createFolhaNews = async (link: string) => {
  console.log('createFolhaNews')
  if (await isNewsCreated(link)) {
    return null
  }

  const html = await getHTML(link)

  const ogMetadata = getOpenGraphMetadata(html)
  const content = getFolhaContent(html)

  const news = await createNews({ sourceCode: 'folha', link, content, ...ogMetadata })

  await relateCategories(news)

  return news
}
