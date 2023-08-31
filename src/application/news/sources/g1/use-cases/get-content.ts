import { type HTMLElement } from 'node-html-parser'

export const getG1Content = (html: HTMLElement) => {
  return [
    html.querySelector('.content-head')?.text.trim(),
    html.querySelector('.content-head__subtitle')?.text.trim(),
    html.querySelectorAll('.content-text__container').map(({ text }) => text.trim()).filter(Boolean).join('\n')
  ].filter(Boolean).join('\n')
}
