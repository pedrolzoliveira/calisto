import { type GenericJson } from '../infra/http/types/generic-json'

export function tryParseJson<T extends GenericJson>(
  data: string
): T | null {
  try {
    return JSON.parse(data)
  } catch (_) {
    return null
  }
}
