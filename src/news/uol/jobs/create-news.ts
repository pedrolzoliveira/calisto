import { createNews } from '../../use-cases/create-news'
import { getHTML } from '../../utils/get-html'
import { getOpenGraphMetadata } from '../../utils/get-open-graph-metadata'
import { isNewsCreated } from '../../utils/is-news-created'
import { getUolContent } from '../use-cases/get-content'
import { getUolLastNewsLinks } from '../use-cases/get-last-news-links'

export const createUolNews = async () => {
  const links = await getUolLastNewsLinks()
  links.forEach(async link => {
    if (await isNewsCreated(link)) {
      return
    }

    const html = await getHTML(link)

    const ogMetadata = getOpenGraphMetadata(html)
    const content = getUolContent(html)

    await createNews({ sourceCode: 'uol', link, content, ...ogMetadata })
  })
}
