import { createNews } from '../../../use-cases/create-news'
import { relateCategories } from '../../../use-cases/relate-categories'
import { getHTML } from '../../../utils/get-html'
import { getOpenGraphMetadata } from '../../../utils/get-open-graph-metadata'
import { isNewsCreated } from '../../../utils/is-news-created'
import { blackList } from '../link-black-list'
import { getG1Content } from './get-content'

export const createG1News = async (link: string) => {
  if (
    blackList.some(blackLink => link.includes(blackLink)) ||
    await isNewsCreated(link)
  ) {
    return null
  }

  const html = await getHTML(link)

  const ogMetadata = getOpenGraphMetadata(html)
  const content = getG1Content(html)

  const news = await createNews({ sourceCode: 'g1', link, content, ...ogMetadata })

  await relateCategories(news)

  return news
}
