import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
@customElement('input-list')
export class InputList extends LitElement {
  protected createRenderRoot(): HTMLElement | ShadowRoot {
    return this
  }

  @property({ type: String })
    name: string = ''

  @property({ type: Array, reflect: true })
    values: string[] = ['Brasil']

  @property({ type: String })
    inputValue: string = ''

  handleKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()

      if (this.inputValue === '') {
        return
      }

      this.values = [
        ...this.values,
        this.inputValue.split(' ').filter(Boolean).join(' ')
      ]
      this.inputValue = ''
    } else if (event.key === 'Backspace' && this.inputValue === '') {
      console.log('backspace')
      this.values = this.values.slice(0, -1)
      console.log(this.values)
    }
  }

  handleInput(event: InputEvent) {
    this.inputValue = (event.target as HTMLInputElement).value
  }

  handleRemove(value: string) {
    this.values = this.values.filter(v => v !== value)
  }

  handleClear() {
    this.values = []
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
                    <input type="checkbox" checked hidden value=${value} name=${this.name}>${value}</input>
                    <button type="button" class="flex items-center rounded-full p-1" @click=${() => this.handleRemove(value)}>
                        <span class="material-symbols-outlined text-xs">close</span>
                      </button>
                  </div>`
              )
            }
          <input type="text" class="outline-none flex-1 [&:not(:first-child)]:border-b border-gray-100 px-1" .value=${this.inputValue} @input=${this.handleInput} @keypress=${this.handleKeypress}></input>
        </div>
      `
  }
}
