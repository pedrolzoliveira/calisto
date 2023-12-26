import { html } from '@lit-labs/ssr';
import { type TemplateResult } from 'lit';

interface LayoutProps {
  header?: TemplateResult | TemplateResult[] | null
  body?: TemplateResult | TemplateResult[] | null
}

export function layout({ header = null, body = null }: LayoutProps) {
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
      <body class="bg-gray-100 flex flex-col overflow-y-scroll">
        ${header}
        ${body}
      </body>
    </html>
  `;
}
