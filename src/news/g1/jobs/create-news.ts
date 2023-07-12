import { createNews } from '../../use-cases/create-news'
import { getHTML } from '../../utils/get-html'
import { getOpenGraphMetadata } from '../../utils/get-open-graph-metadata'
import { isNewsCreated } from '../../utils/is-news-created'
import { getG1Content } from '../use-cases/get-content'
import { getG1LastNewsLinks } from '../use-cases/get-last-news-links'
import { blackList } from '../link-black-list'

export const createG1News = async () => {
  const links = await getG1LastNewsLinks()
  links.forEach(async link => {
    if (
      blackList.some(blackLink => link.includes(blackLink)) ||
      await isNewsCreated(link)
    ) {
      return
    }

    const html = await getHTML(link)

    const ogMetadata = getOpenGraphMetadata(html)
    const content = getG1Content(html)

    await createNews({ sourceCode: 'g1', link, content, ...ogMetadata })
  })
}
