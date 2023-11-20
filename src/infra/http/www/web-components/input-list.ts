import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space'
import { LitElement, type PropertyValueMap, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { parseScapedJson } from '../utils/parse-scaped-json'

@customElement('input-list')
export class InputList extends LitElement {
  protected createRenderRoot(): HTMLElement | ShadowRoot {
    return this
  }

  static readonly formAssociated = true
  private readonly internals: ElementInternals = this.attachInternals()

  @query('input[type="text"]')
    input!: HTMLInputElement

  @property({ type: String, reflect: true })
    name: string = ''

  @property({
    type: String,
    converter: value => {
      if (!value) {
        return []
      }
      return parseScapedJson(value)
    }
  })
    value: string[] = []

  @property({ type: String })
    inputValue: string = ''

  @property({ type: Boolean })
    required: boolean = false

  validate() {
    if (this.required && this.value.length === 0) {
      this.internals.setValidity({ valueMissing: true }, 'Crie ao menos uma categoria.', this.input)
      return
    }

    this.internals.setValidity({})
  }

  protected update(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.update(changedProperties)
    if (changedProperties.has('value')) {
      this.validate()
    }
  }

  handleKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()

      if (
        this.value.includes(this.inputValue) ||
        this.inputValue === ''
      ) {
        return
      }

      this.value = [...this.value, sanitizeWhiteSpace(this.inputValue)]
      this.inputValue = ''
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.inputValue === '') {
      this.value = this.value.slice(0, -1)
    }
  }

  handleInput(event: InputEvent) {
    this.inputValue = (event.target as HTMLInputElement).value
  }

  handleRemove(value: string) {
    this.value = this.value.filter(v => v !== value)
  }

  render() {
    return html`
        <div class="bg-white px-1 py-1 rounded border flex items-center space-x-1 flex-wrap w-96">
            ${
              repeat(
                this.value,
                value => value,
                value => html`
                 <div class="text-xs px-2 rounded bg-gray-200 text-gray-700 flex items-center space-x-1 m-1">
                    <p>${value}</p>
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
