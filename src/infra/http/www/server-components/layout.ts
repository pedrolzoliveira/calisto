import { html } from '@/src/packages/lit-ssr/server-template';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('lbn-layout')
export class Layout extends LitElement {
  createRenderRoot() {
    return this;
  }

  render () {
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
          <slot name="header"></slot>
          <slot name="body"></slot>
        </body>
      </html>
    `;
  }
}
