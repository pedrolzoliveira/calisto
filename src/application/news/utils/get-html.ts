import axios, { AxiosError } from 'axios'
import { parse } from 'node-html-parser'
import { logger } from '@/src/infra/logger'

export const getHTML = async (link: string) => {
  const response = await axios.get(link).catch(error => {
    if (error instanceof AxiosError) {
      logger.error({ message: `error fetching html from link ${link}`, link, error: error.toJSON(), response: error.response?.data })
    } else {
      logger.error(`unknown error getting html from ${link}`)
    }
    throw error
  })

  try {
    const html = parse(response.data)
    html.querySelectorAll('script').forEach(script => script.remove())
    return html
  } catch (error) {
    logger.error({ message: `error parsing html for link ${link}`, error, link, response: response.data })
    throw error
  }
}
