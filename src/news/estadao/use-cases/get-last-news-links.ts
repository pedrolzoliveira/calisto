import { getHTML } from '../../utils/get-html'

export const getEstadaoLastNewsLinks = async () => {
  const html = await getHTML('https://www.estadao.com.br/noticias-ultimas')

  return html.querySelectorAll('.noticias-mais-recenter--item').reduce<string[]>((arr, post) => {
    const link = post.querySelector('a')?.getAttribute('href')

    if (link) {
      arr.push(link)
    }

    return arr
  }, [])
}
