import { html } from '@lit-labs/ssr';
import { repeat } from 'lit/directives/repeat.js';
import { nothing } from 'lit';
export function learnMorePage(sources: string[]) {
  return html`
    <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <link rel="stylesheet" href="/dist/tailwind.css">
        <link rel="icon" type="image/x-icon" href="/assets/flare.svg">
        <title>Light Beam News</title>
      </head>
      <body class="bg-gray-100">
        <main class="p-4">
          <div class="flex space-x-4 items-center justify-center">
            <img class="h-16" src="/assets/logo.svg" alt="logo"/>
          </div>
          <section>
            <h2 class="text-2xl font-bold my-2">O que é Light Beam News?</h2>
            <p>Light Beam News é um agregador de notícias, impulsionado por inteligência artificial, projetado para simplificar a maneira como você consome notícias. Nosso objetivo é proporcionar uma experiência personalizada de leitura de notícias, agregando conteúdo relevante de várias fontes em um único lugar, com base em tópicos de interesse especificados por você.</p>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold my-2">Como Funciona?</h2>
            <ul class="list-disc ml-8 my-2">
              <li><strong>Criação de Perfil Personalizado:</strong> Inicie criando seu perfil e insira os tópicos que mais lhe interessam.</li>
              <li><strong>Agregação Inteligente de Notícias:</strong> Nós agregamos as últimas notícias com base nas categorias escolhidas.</li>
              <li><strong>Leitura Ininterrupta com Endless Scroll:</strong> Desfrute de uma leitura contínua com nosso recurso de scroll infinito. Novas notícias relevantes são carregadas automaticamente no início da página, garantindo que você esteja sempre atualizado com as últimas notícias.</li>
            </ul>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold my-2">Por que Escolher Light Beam News?</h2>
            <ul class="list-disc ml-8 my-2">
              <li><strong>Personalização:</strong> Receba notícias que se alinham exatamente com seus interesses. Esqueça as notícias irrelevantes e concentre-se no que realmente importa para você.</li>
              <li><strong>Eficiência:</strong> Economize tempo com nossa IA que filtra e entrega o conteúdo mais pertinente de múltiplas fontes em um feed fácil de navegar.</li>
              <li><strong>Diversidade de Fontes:</strong> Acesso a uma ampla gama de fontes de notícias, proporcionando uma visão abrangente sobre cada tópico de interesse.</li>
            </ul>
          </section>
          ${
            sources.length
            ? html`
            <section>
              <h2 class="text-2xl font-bold my-2">Sites de notícias monitorados no momento:</h2>
              <ul class="list-disc ml-8 my-2">
                ${repeat(sources, (source) => html`<li>${source}</li>`)}
              </ul>
            </section>
            `
            : nothing
          }
          <section>
            <h2 class="text-2xl font-bold my-2">Entre em contanto!</h2>
            <p>Para mais informações, entre em contato conosco através do email: <strong>contact@lightbeam.news</strong></p>
          </section>
          <section>
            <h2 class="text-2xl font-bold my-2">Comece Agora!</h2>
            <p>Pronto para transformar a maneira como você consome notícias? <a class="text-blue-600 italic hover:underline" href="/users/sign-up">Crie sua conta agora</a>.</p>
          </section>
        </main>
      </body>
    </html>
  `;
}
