import { type HTMLElement } from 'node-html-parser'

export const getFolhaContent = (html: HTMLElement) => {
  return [
    html.querySelector('.c-content-head__title')?.text.trim(),
    html.querySelector('.c-content-head__subtitle')?.text.trim(),
    html.querySelectorAll('div.c-news__body > p').map(({ text }) => text.trim()).filter(Boolean).join('\n')
  ].filter(Boolean).join('\n')
}
