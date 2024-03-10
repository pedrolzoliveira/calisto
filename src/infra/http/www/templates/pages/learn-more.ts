import { html } from '@lit-labs/ssr';

export function learnMorePage() {
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
          <h1 class="text-3xl font-bold my-4">Saiba Mais Sobre Light Beam News</h1>
          <section>
            <h2 class="text-2xl font-bold my-2">O que é Light Beam News?</h2>
            <p>Light Beam News é um agregador de notícias inovador, impulsionado por inteligência artificial, projetado para simplificar a maneira como você consome notícias. Nosso objetivo é proporcionar uma experiência personalizada de leitura de notícias, agregando conteúdo relevante de várias fontes em um único lugar, com base em tópicos de interesse especificados por você.</p>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold my-2">Como Funciona?</h2>
            <p>Com Light Beam News, dizer adeus ao incômodo de navegar por múltiplas plataformas de notícias é simples. Aqui está como você pode começar a desfrutar de uma leitura de notícias sob medida:</p>
            <ul class="list-disc ml-8 my-2">
              <li><strong>Criação de Perfil Personalizado:</strong> Inicie criando seu perfil e insira os tópicos que mais lhe interessam. Você pode escolher entre uma vasta gama de categorias, como Tecnologia, Política, Esportes, Cultura, e muito mais.</li>
              <li><strong>Agregação Inteligente de Notícias:</strong> Nossa tecnologia de IA analisa suas preferências e compila um feed personalizado de notícias, reunindo artigos relevantes de diversas fontes confiáveis. Quanto mais você usa Light Beam News, mais nosso algoritmo aprende sobre suas preferências, refinando ainda mais a seleção de notícias.</li>
              <li><strong>Leitura Ininterrupta com Endless Scroll:</strong> Desfrute de uma leitura contínua com nosso recurso de scroll infinito. À medida que você lê, novas histórias relevantes são carregadas automaticamente, garantindo que você esteja sempre atualizado com as últimas notícias.</li>
            </ul>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold my-2">Por que Escolher Light Beam News?</h2>
            <ul class="list-disc ml-8 my-2">
              <li><strong>Personalização:</strong> Receba notícias que se alinham exatamente com seus interesses. Esqueça as notícias irrelevantes e concentre-se no que realmente importa para você.</li>
              <li><strong>Eficiência:</strong> Economize tempo com nossa IA que filtra e entrega o conteúdo mais pertinente de múltiplas fontes em um feed fácil de navegar.</li>
              <li><strong>Atualização Constante:</strong> Com o endless scroll, nosso serviço garante que você esteja sempre a par das últimas notícias sem a necessidade de buscar em outras plataformas.</li>
              <li><strong>Diversidade de Fontes:</strong> Acesso a uma ampla gama de fontes de notícias, proporcionando uma visão abrangente sobre cada tópico de interesse.</li>
            </ul>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold my-2">Comece Agora!</h2>
            <p>Pronto para transformar a maneira como você lê notícias? <a class="text-blue-600 italic hover:underline" href="/users/sign-up">Crie sua conta agora</a>. Junte-se à Light Beam News e faça parte de uma nova era de leitura de notícias personalizada.</p>
          </section>
        </main>
      </body>
    </html>
  `;
}
