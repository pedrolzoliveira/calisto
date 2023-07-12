import { getHTML } from '../../utils/get-html'

export const getUolLastNewsLinks = async () => {
  const html = await getHTML('https://noticias.uol.com.br/ultimas')

  return html.querySelectorAll('.results-items a').reduce<string[]>((arr, linkElement) => {
    const link = linkElement.getAttribute('href')

    if (link) {
      arr.push(link)
    }

    return arr
  }, [])
}
