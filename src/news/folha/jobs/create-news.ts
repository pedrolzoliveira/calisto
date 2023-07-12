import { prismaClient } from '@/prisma/client'
import { createNews } from '../../use-cases/create-news'
import { getHTML } from '../../utils/get-html'
import { getOpenGraphMetadata } from '../../utils/get-open-graph-metadata'
import { isNewsCreated } from '../../utils/is-news-created'
import { getFolhaContent } from '../use-cases/get-content'
import { getFolhaLastNewsLinks } from '../use-cases/get-last-news-links'
import { relateCategoriesQueue } from '@/src/chat-gpt/queues/relate-categories'

export const createFolhaNews = async () => {
  const links = await getFolhaLastNewsLinks()
  links.forEach(async link => {
    if (await isNewsCreated(link)) {
      return
    }

    const html = await getHTML(link)

    const ogMetadata = getOpenGraphMetadata(html)
    const content = getFolhaContent(html)

    await createNews({ sourceCode: 'folha', link, content, ...ogMetadata })

    const result = await prismaClient.$queryRaw<Array<{ tag: string }>>`SELECT DISTINCT tag FROM "ProfileTag"`

    if (result.length) {
      const categories = result.map(({ tag }) => tag) as [string, ...string[]]
      console.log('jobs/create-news', link, categories)
      await relateCategoriesQueue.send({ link, content, categories })
    }
  })
}
