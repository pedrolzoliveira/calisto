import { type HTMLElement } from 'node-html-parser'

export const getValorContent = (html: HTMLElement) => {
  return [
    html.querySelector('.content-head__title')?.text.trim(),
    html.querySelector('.content-head__subtitle')?.text.trim(),
    html.querySelectorAll('p.content-text__container').map(({ text }) => text.trim()).filter(Boolean).join('\n')
  ].filter(Boolean).join('\n')
}
