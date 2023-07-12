import axios from 'axios'
import { parse } from 'node-html-parser'

export const getHTML = async (link: string) => {
  const response = await axios.get(link)
  const html = parse(response.data)
  html.querySelectorAll('script').forEach(script => script.remove())
  return html
}
