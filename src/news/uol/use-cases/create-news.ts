import { createNews } from '../../use-cases/create-news'
import { getHTML } from '../../utils/get-html'
import { getOpenGraphMetadata } from '../../utils/get-open-graph-metadata'
import { isNewsCreated } from '../../utils/is-news-created'
import { getUolContent } from './get-content'
import { blackList } from '../link-black-list'

export const createUolNews = async (link: string) => {
  if (
    blackList.some((blackListLink) => link.includes(blackListLink)) ||
    await isNewsCreated(link)
  ) {
    return null
  }

  const html = await getHTML(link)

  const ogMetadata = getOpenGraphMetadata(html)
  const content = getUolContent(html)

  return await createNews({ sourceCode: 'uol', link, content, ...ogMetadata })
}
