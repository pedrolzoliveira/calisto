import { type HTMLElement } from 'node-html-parser'

export const getEstadaoContent = (html: HTMLElement) => {
  return [
    html.querySelector('h1')?.text.trim(),
    html.querySelector('h2')?.text.trim(),
    html.querySelectorAll('.styles__ParagraphStyled-rhi54a-0').map(({ text }) => text.trim()).filter(Boolean).join('\n')
  ].filter(Boolean).join('\n')
}
