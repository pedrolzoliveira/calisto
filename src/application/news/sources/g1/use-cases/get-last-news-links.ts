import { getHTML } from '../../../utils/get-html'

export const getG1LastNewsLinks = async () => {
  const html = await getHTML('https://g1.globo.com/ultimas-noticias')

  return html.querySelectorAll('.feed-post-body').reduce<string[]>((arr, post) => {
    const link = post.querySelector('a')?.getAttribute('href')

    if (link) {
      arr.push(link)
    }

    return arr
  }, [])
}
