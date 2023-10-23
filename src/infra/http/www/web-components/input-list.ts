import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space'
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
@customElement('input-list')
export class InputList extends LitElement {
  protected createRenderRoot(): HTMLElement | ShadowRoot {
    return this
  }

  @property({ type: String, reflect: true })
    name: string = ''

  @property({
    type: Array,
    reflect: true,
    // TODO: refactor converter function
    // Make it be able to proper mapping the received value and vice versa
    // Look how the property changes in the developer tools
    converter(value, type) {
      if (!value) {
        return []
      }
      return value.split(',')
    }
  })
    values: string[] = []

  @property({ type: String })
    inputValue: string = ''

  // TODO: when required don't let the form be submitted
  @property({ type: Boolean })
    required: boolean = false

  handleKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()

      if (
        this.values.includes(this.inputValue) ||
        this.inputValue === ''
      ) {
        return
      }

      this.values.push(sanitizeWhiteSpace(this.inputValue))
      this.inputValue = ''
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.inputValue === '') {
      this.values = this.values.slice(0, -1)
    }
  }

  handleInput(event: InputEvent) {
    this.inputValue = (event.target as HTMLInputElement).value
  }

  handleRemove(value: string) {
    this.values = this.values.filter(v => v !== value)
  }

  render() {
    return html`
        <div class="bg-white px-1 py-1 rounded border flex items-center space-x-1 flex-wrap w-96">
            ${
              repeat(
                this.values,
                value => value,
                value => html`
                 <div class="text-xs px-2 rounded bg-gray-200 text-gray-700 flex items-center space-x-1 m-1">
                    <input type="checkbox" checked hidden value=${value} name="${this.name}[]">${value}</input>
                    <button type="button" class="flex items-center rounded-full p-1" @click=${() => this.handleRemove(value)}>
                        <span class="material-symbols-outlined text-xs">close</span>
                      </button>
                  </div>`
              )
            }
          <input type="text" class="outline-none flex-1 [&:not(:first-child)]:border-b border-gray-100 px-1" .value=${this.inputValue} @input=${this.handleInput} @keypress=${this.handleKeypress} @keydown=${this.handleKeyDown}></input>
        </div>
      `
  }
}
