import { html } from '@lit-labs/ssr';
import { buttonClass } from '../styles/button';
import { twJoin } from 'tailwind-merge';

export function landingPage() {
  return html`
    <!DOCTYPE html>
    <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="/dist/bundle.js"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <link rel="stylesheet" href="/dist/tailwind.css">
        <link rel="icon" type="image/x-icon" href="/assets/flare.svg">
        <title>Light Beam News</title>
      </head>
      <body class="bg-gray-100 flex flex-col w-full">
        <main class="flex flex-col p-4 lg:flex-row items-center justify-around w-screen h-screen">
          <div class="flex flex-col justify-center space-y-2 w-full sm:w-96 lg:w-[50vw] lg:pl-[20vw]">
            <img class="pb-12" src="/assets/logo.svg" alt="logo"/>
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
          <div id="newsFeed" class="hidden lg:flex flex-col space-y-2 h-screen overflow-x-hidden overflow-y-hidden items-center w-[50vw]">
            <div id="news-loader" hx-get="/fetch-landing-page-news" hx-swap="outerHTML" hx-trigger="revealed" hx></div>
          </div>
        </main>
      <script>
        // GPT-4 generated 
        function animateScroll(element, duration) {
          let start = element.scrollTop;
          let end = element.scrollHeight - element.clientHeight;
          let change = end - start;
          let startTime = performance.now();

          function scroll() {
            let now = performance.now();
            let elapsed = now - startTime;
            let fraction = elapsed / duration;

            if (fraction < 1) {
              // Calculate the current scroll position
              let currentPosition = start + change * fraction;
              element.scrollTop = currentPosition;
              requestAnimationFrame(scroll);
            } else {
              // Once we hit the bottom, reset to the top and start over
              element.scrollTop = 0;
              animateScroll(element, duration); // Repeat the animation
            }
          }
          scroll();
        }
        // maybe we can use htmx:afterRequest - I did not did it right now cause I was afraid it would not work in the case where the request is done but the element is not swapped yet
        // I need to investigate to see if this is really possible
        // the only problem with afterSwap is that it's running multiples times
        document.body.addEventListener('htmx:afterSwap', () => {
          let newsFeed = document.getElementById('newsFeed');
          if (newsFeed) {
            animateScroll(newsFeed, 60_000); // Adjust the duration as needed
          }
        });
      </script>
      </body>
    </html>
  `;
};
