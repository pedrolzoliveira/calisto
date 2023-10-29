import { html, type TemplateResult } from 'lit'

interface LayoutProps {
  header: TemplateResult
  body: TemplateResult
}

export function layout({ header, body }: LayoutProps) {
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
      <body class="bg-gray-100">
        ${header}
        ${body}
      </body>
    </html>
  `
}
