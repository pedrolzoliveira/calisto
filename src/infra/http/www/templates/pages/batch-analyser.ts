import { html } from '@lit-labs/ssr'
import { type BatchAnalyserProps } from '../../web-components/batch-analyser'

export function batchAnalyserPage(batch: BatchAnalyserProps) {
  return html`<batch-analyser batch=${JSON.stringify(batch)}></batch-analyser>`
}
