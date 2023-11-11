import { type TemplateResult, html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { type ClassNameValue, twMerge } from 'tailwind-merge'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | 'menu'
  className?: ClassNameValue
  content: TemplateResult | TemplateResult[] | string
}

export function button({ className, content, type }: ButtonProps) {
  return html`
    <button type=${ifDefined(type)} class="${twMerge('rounded bg-blue-700 hover:bg-blue-600 text-white px-3 py-2', className)}">
      ${content}  
    </button>
  `
}
