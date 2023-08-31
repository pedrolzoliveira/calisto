import { getHTML } from '../../../utils/get-html'

export const getValorLastNewsLinks = async () => {
  const html = await getHTML('https://valor.globo.com/ultimas-noticias')

  return html.querySelectorAll('.feed-post-body').reduce<string[]>((arr, post) => {
    const link = post.querySelector('a')?.getAttribute('href')

    if (link) {
      arr.push(link)
    }

    return arr
  }, [])
}
