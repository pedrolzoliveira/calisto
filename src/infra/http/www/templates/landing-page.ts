import { html } from '@lit-labs/ssr';

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
        <title>Calisto</title>
      </head>
      <body class="bg-gray-100 flex flex-col items-center justify-center w-full">
        <div class="flex justify-between w-2/3">
          <div>
            <h1 class="text-4xl">Fique por dentro do que te interessa.</h1>
            <p class="text-sm">Utilizamos IA para filtrar notícias importantes para você!</p>
          </div>
          <img class="w-2/3" src="/assets/news-example-1.jpeg" alt="imagem mostrando a aplicação?"/>
        </div>
        <div>
          <h1 class="text-4xl">Como funciona?</h1>
          <p>Nos ficamos de olho nos principais canais de noticias do pais, e quando uma noticia que te interessa aparecer, nos mostramos ela no seu feed</p>
        </div>
        <div>
          <h1 class="text-4xl">Perfis personalizados</h1>
          <p>Personalize perfis de acordo com sua necessidade</p>
          <img class="w-96 h-96 border border-red-500" alt="imagem mostrando os perfis"/>
        </div>
        <div>
          <h1 class="text-4xl">Precos</h1>
          <!-- mostrar 3 categorias de preco -->
        </div>
      </body>
    </html>
  `;
};
