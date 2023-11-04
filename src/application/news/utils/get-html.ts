import axios, { AxiosError } from 'axios'
import { parse, HTMLElement } from 'node-html-parser'
import { logger } from '@/src/infra/logger'

export const getHTML = async (link: string): Promise<HTMLElement> => {
  const response = await axios.get(link).catch(error => {
    if (error instanceof AxiosError) {
      logger.error({ message: `error fetching html from link ${link}`, link, error: error.toJSON(), response: error.response?.data })
    } else {
      logger.error(`unknown error getting html from ${link}`)
    }
    throw error
  })

  try {
    return parse(response.data)
  } catch (error) {
    logger.error({ message: `error parsing html for link ${link}`, error, link, response: response.data })
    throw error
  }
}
