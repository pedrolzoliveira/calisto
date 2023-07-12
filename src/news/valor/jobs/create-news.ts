import { createNews } from '../../use-cases/create-news'
import { getHTML } from '../../utils/get-html'
import { getOpenGraphMetadata } from '../../utils/get-open-graph-metadata'
import { isNewsCreated } from '../../utils/is-news-created'
import { getValorContent } from '../use-cases/get-content'
import { getValorLastNewsLinks } from '../use-cases/get-last-news-links'

export const createValorNews = async () => {
  const links = await getValorLastNewsLinks()
  links.forEach(async (link) => {
    if (await isNewsCreated(link)) {
      return
    }

    const html = await getHTML(link)

    const ogMetadata = getOpenGraphMetadata(html)
    const content = getValorContent(html)

    await createNews({ sourceCode: 'valor', link, content, ...ogMetadata })
  })
}
