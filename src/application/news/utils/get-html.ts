import axios, { AxiosError } from 'axios'
import { parse } from 'node-html-parser'
import { logger } from '@/src/infra/logger'

export const getHTML = async (link: string) => {
  const response = await axios.get(link).catch(error => {
    if (error instanceof AxiosError) {
      logger.error({ error, link, response: error.response?.data })
    } else {
      logger.error({ error, link })
    }
    throw error
  })

  try {
    const html = parse(response.data)
    html.querySelectorAll('script').forEach(script => script.remove())
    return html
  } catch (error) {
    logger.error({ error, link, response: response.data })
    throw error
  }
}
