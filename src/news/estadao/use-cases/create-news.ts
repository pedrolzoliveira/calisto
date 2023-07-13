import { createNews } from '../../use-cases/create-news'
import { getHTML } from '../../utils/get-html'
import { getOpenGraphMetadata } from '../../utils/get-open-graph-metadata'
import { isNewsCreated } from '../../utils/is-news-created'
import { getEstadaoContent } from './get-content'

export const createEstadaoNews = async (link: string) => {
  if (await isNewsCreated(link)) {
    return null
  }

  const html = await getHTML(link)

  const ogMetadata = getOpenGraphMetadata(html)
  const content = getEstadaoContent(html)

  return await createNews({ sourceCode: 'estadao', link, content, ...ogMetadata })
}
