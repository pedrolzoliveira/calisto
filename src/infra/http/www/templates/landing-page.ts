import { html } from '@lit-labs/ssr';
import { repeat } from 'lit/directives/repeat.js';
import { type NewsCardProps, newsCard } from './components/news-card';
import { buttonClass } from './styles/button';

export function landingPage(news: NewsCardProps[]) {
  return html`
    <!DOCTYPE html>
    <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="/dist/bundle.js"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <link rel="stylesheet" href="/dist/tailwind.css">
        <title>Calisto</title>
      </head>
      <body class="bg-gray-100 flex flex-col w-full">
        <div class="flex justify-around w-full h-screen">
          <div class="flex flex-col justify-center space-y-2 w-[50vw] pl-[20vw]">
            <h1 class="text-5xl">Fique por dentro do que te interessa.</h1>
            <p class="text-xs">Utilizamos IA para filtrar notícias relevantes para você, criando um feed personalizado para suas necessidades, facilitando sua busca por informação!</p>
            <button class="${buttonClass}">Teste de graça por uma semana!</button>
          </div>
          <div id="newsFeed" class="flex flex-col space-y-2 h-screen overflow-x-hidden overflow-y-hidden items-center w-[50vw]">
            ${repeat(news, newsCard)}
          </div>
        </div>
        <div class="h-screen">
          <h1 class="text-4xl">Como funciona?</h1>
          <p>Nós monitoramos os principais canais de notícias do país, e quando uma notícia que te interessa aparecer, nós a mostraremos no seu feed</p>
        </div>
        <div class="h-screen">
          <h1 class="text-4xl">Canais de notícias que nos monitoramos no momento</h1>
          <p>Mostrar os canais de noticias</p>
        </div>
        <div class="h-screen">
          <h1 class="text-4xl">Perfis personalizados</h1>
          <p>Personalize perfis de acordo com sua necessidade</p>
          <img class="w-96 h-96 border border-red-500" alt="imagem mostrando os perfis"/>
        </div>
        <div class="h-screen">
          <h1 class="text-4xl">Precos</h1>
        </div>
      <script>
        setInterval(() => newsFeed.scrollBy({ top: 8, behavior: 'smooth' }), 40)
      </script>
      </body>
    </html>
  `;
};
