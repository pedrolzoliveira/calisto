import { html } from '@lit-labs/ssr';
import { buttonClass } from '../styles/button';
import { twJoin } from 'tailwind-merge';
import { newsCard, type NewsCardProps } from '../components/news-card';

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
          <div id="newsFeed" class="hidden lg:block h-screen overflow-x-hidden overflow-y-hidden w-[50vw]">
            <div id="newsFeedInner" class="flex flex-col space-y-2 items-center animate-scroll">
              ${
                news.length
                ? news.map(newsCard)
                : html`<div id="news-loader" hx-get="/fetch-landing-page-news" hx-swap="outerHTML" hx-trigger="load"></div>`
              }
            </div>
          </div>
        </main>
        <style>
          #newsFeedInner { animation: scroll 60s linear infinite }
          @keyframes scroll {
            to { transform: translateY(calc(-50% - 0.25rem)) }
          }
        </style>
        ${
          news.length
          ? html`
            <script type="text/javascript">
              const newsCards = Array.from(newsFeedInner.children);
              newsCards.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute('aria-hidden', true);
                newsFeedInner.appendChild(duplicatedItem);
              });
            </script>
          `
          : html`
            <script type="text/javascript">
              document.body.addEventListener('htmx:afterRequest', (e) => {
                if (!e.detail.successful) {
                  return;
                }

                const newsCards = Array.from(newsFeedInner.children);
                newsCards.forEach((item) => {
                  const duplicatedItem = item.cloneNode(true);
                  duplicatedItem.setAttribute('aria-hidden', true);
                  newsFeedInner.appendChild(duplicatedItem);
                });
              })
            </script>
          `
        }
        <script type="text/javascript">
          var _iub = _iub || [];
          _iub.csConfiguration = {"askConsentAtCookiePolicyUpdate":true,"enableGdpr":false,"enableLgpd":true,"floatingPreferencesButtonDisplay":"bottom-right","lang":"pt-BR","perPurposeConsent":true,"siteId":3614416,"whitelabel":false,"cookiePolicyId":25194377, "banner":{ "acceptButtonCaptionColor":"#FFFFFF","acceptButtonColor":"#0073CE","acceptButtonDisplay":true,"backgroundColor":"#FFFFFF","closeButtonDisplay":false,"customizeButtonCaptionColor":"#4D4D4D","customizeButtonColor":"#DADADA","customizeButtonDisplay":true,"explicitWithdrawal":true,"position":"bottom","rejectButtonCaptionColor":"#FFFFFF","rejectButtonColor":"#0073CE","rejectButtonDisplay":true,"showTitle":false,"textColor":"#000000" }};
        </script>
        <script type="text/javascript" src="https://cs.iubenda.com/autoblocking/3614416.js"></script>
        <script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async></script>
      </body>
    </html>
  `;
};
