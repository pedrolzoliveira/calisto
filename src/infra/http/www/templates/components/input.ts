import { html } from '@lit-labs/ssr'
import { ifDefined } from 'lit/directives/if-defined.js'
import { twMerge, type ClassNameValue } from 'tailwind-merge'

interface InputProps {
  id?: string
  type?: 'password' | 'email' | 'text'
  value?: string
  name?: string
  minlength?: number
  maxlength?: number
  required?: boolean
  className?: string | ClassNameValue
}

export const input = ({ id, type, name, minlength, maxlength, value, required, className }: InputProps) => {
  return html`
    <input
      id=${ifDefined(id)}
      ?required=${required}
      type=${ifDefined(type)}
      name=${ifDefined(name)}
      class="${twMerge('px-3 py-2 rounded border', className)}"
      minlength=${ifDefined(minlength)}
      maxlength=${ifDefined(maxlength)}
      value=${ifDefined(value)}
    ></input>
  `
}
