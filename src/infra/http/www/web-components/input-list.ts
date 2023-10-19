import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('input-list')
export class InputList extends LitElement {
  protected createRenderRoot(): HTMLElement | ShadowRoot {
    return this
  }

  @property({ type: Array, reflect: true })
    values: string[] = ['teste', 'b']

  render() {
    console.log(this.values)
    return html`
        <div>
          <div>
            ${
              this.values.map(value => html`<p>${value}</p>`)
            }
          </div>
          <input></input>
        </div>
      `
  }
}
