import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space';
import { LitElement, type PropertyValueMap, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

@customElement('input-list')
export class InputList extends LitElement {
  createRenderRoot() {
    return this;
  }

  static readonly formAssociated = true;
  private readonly internals: ElementInternals = this.attachInternals();

  @query('input[type="text"]')
    input!: HTMLInputElement;

  @property({ type: String, reflect: true })
    name: string = '';

  @property({ type: Array })
    value: string[] = [];

  @property({ type: Number })
    maxLength: number = Infinity;

  @property({ type: String })
    inputValue: string = '';

  @property({ type: Number })
    inputMaxLength: number = Infinity;

  @property({ type: Boolean })
    required: boolean = false;

  validate() {
    if (this.required && this.value.length === 0) {
      const errorMessage = this.inputValue.length ? 'Pressione Enter para adicionar a categoria.' : 'Crie ao menos uma categoria.';
      this.internals.setValidity({ valueMissing: true }, errorMessage, this.input);
      return;
    }

    this.internals.setValidity({});
  }

  protected update(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.update(changedProperties);
    if (changedProperties.has('value') || changedProperties.has('inputValue')) {
      this.validate();
    }
  }

  handleKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (
        this.value.includes(this.inputValue) ||
        this.value.length >= this.maxLength ||
        this.inputValue === ''
      ) {
        return;
      }

      this.value = [...this.value, sanitizeWhiteSpace(this.inputValue)];
      this.inputValue = '';
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.inputValue === '') {
      this.value = this.value.slice(0, -1);
    }
  }

  handleInput(event: InputEvent) {
    if (this.value.length >= this.maxLength) {
      this.inputValue = '';
      (event.target as HTMLInputElement).value = '';
      return;
    }

    this.inputValue = (event.target as HTMLInputElement).value;
  }

  handleRemove(value: string) {
    this.value = this.value.filter(v => v !== value);
  }

  handleDivClick() {
    this.input.focus();
  }

  render() {
    return html`
      <div>
        <p class="text-xs mb-1">Para adicionar a categoria, aperte Enter.</p>
        <div class="bg-white px-1 py-1 rounded border flex items-center space-x-1 flex-wrap cursor-text" @click=${this.handleDivClick}>
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
          <input
            maxlength=${this.inputMaxLength}
            type="text"
            class="outline-none flex-1 border-gray-100 px-1"
            .value=${this.inputValue}
            @input=${this.handleInput}
            @keypress=${this.handleKeypress}
            @keydown=${this.handleKeyDown}
            />
          </div>
          ${this.maxLength !== Infinity ? html`<p class="text-xs text-right">${this.value.length}/${this.maxLength}</p>` : nothing}
      </div>
      `;
  }
}
