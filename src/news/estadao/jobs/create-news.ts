import { createNews } from '../../use-cases/create-news'
import { getHTML } from '../../utils/get-html'
import { getOpenGraphMetadata } from '../../utils/get-open-graph-metadata'
import { isNewsCreated } from '../../utils/is-news-created'
import { getEstadaoContent } from '../use-cases/get-content'
import { getEstadaoLastNewsLinks } from '../use-cases/get-last-news-links'

export const createEstadaoNews = async () => {
  const links = await getEstadaoLastNewsLinks()
  links.forEach(async link => {
    if (await isNewsCreated(link)) {
      return
    }

    const html = await getHTML(link)

    const ogMetadata = getOpenGraphMetadata(html)
    const content = getEstadaoContent(html)

    await createNews({ sourceCode: 'estadao', link, content, ...ogMetadata })
  })
}
