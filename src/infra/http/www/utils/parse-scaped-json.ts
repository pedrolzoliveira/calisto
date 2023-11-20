import { type GenericJson } from '../../types/generic-json'

export function parseScapedJson(json: string): GenericJson {
  return JSON.parse(json.replace(/&quot;/g, '"'))
}
