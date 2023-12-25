import { html } from '@lit-labs/ssr';
import { repeat } from 'lit/directives/repeat.js';
import { type NewsCardProps, newsCard } from '../components/news-card';
import { buttonClass } from '../styles/button';
import { twJoin } from 'tailwind-merge';

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
        <title>Light Beam News</title>
      </head>
      <body class="bg-gray-100 flex flex-col w-full">
        <div class="flex justify-around w-full h-screen">
          <div class="flex flex-col justify-center space-y-2 w-[50vw] pl-[20vw]">
            <h1 class="text-5xl">Fique por dentro do que te interessa.</h1>
            <p class="text-sm">Utilizamos IA para filtrar notícias relevantes para você, criando um feed personalizado para suas necessidades, facilitando sua busca por informação!</p>          
            <a class="${twJoin(buttonClass, 'flex justify-center')}" href="/users/sign-up">Inscreva-se!</a>
            <div class="flex justify-between w-full">
              <a class="text-sm text-blue-600 italic hover:underline w-full" href="/learn-more">Saiba mais</a>
              <p class="text-sm w-full text-end">
                Já tem uma conta?
                <a class="text-blue-600 italic hover:underline" href="/users/sign-in">Entrar</a>
              </p>
            </div>
          </div>
          <div id="newsFeed" class="flex flex-col space-y-2 h-screen overflow-x-hidden overflow-y-hidden items-center w-[50vw]">
            ${repeat(news, newsCard)}
          </div>
        </div>
      <script>
        function scrollNewsFeed() {
          newsFeed.scrollBy({ top: 2, behavior: 'smooth' })
        }

        scrollNewsFeed()
        newsFeed.addEventListener("scrollend", scrollNewsFeed)
      </script>
      </body>
    </html>
  `;
};
