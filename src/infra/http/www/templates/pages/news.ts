import { html } from 'lit'
import { match } from 'ts-pattern'
import { type NewsCardProps } from '../components/news-card'
import { newsFeed } from '../components/news-feed'

interface NewsPageProps {
  news: NewsCardProps[]
  profileId?: string | null
}

export function newsPage(props: NewsPageProps) {
  return html`
    <main class="space-y-4 flex justify-center items-center flex-col py-4">
      ${
        match(props)
          .with({ profileId: undefined }, () => html`
            <p class="text-center">Crie um perfil para ver as notícias!</p>
            <p class="text-center">Clique em <a href="/profiles/new">Gerenciar Perfis</a> para criar um perfil.</p>
          `)
          .with({ news: [] }, () => html`
            <p>Nenhuma notícia por enquanto!</p>
            <p>Assim que tivermos notícias relacionadas às categorias pedidas, elas vão aparecer aqui!</p>
          `)
          .otherwise(({ news, profileId }) => {
            return newsFeed({
              news,
              profileId: profileId as string
            })
          })
      }
    </main>
  `
}
