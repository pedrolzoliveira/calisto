import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('lbn-flex-container')
export class TestComponent extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="flex">
        <slot name="lmao"></slot>
      </div>
    `;
  }
}
