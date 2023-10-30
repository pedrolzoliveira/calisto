import { type TemplateResult } from 'lit-html'

declare module 'express-serve-static-core' {
  export interface Response {
    renderTemplate: (template: TemplateResult | TemplateResult[]) => void
  }
}
