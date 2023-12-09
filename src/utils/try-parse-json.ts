import { type GenericJson } from '../infra/http/types/generic-json';

export function tryParseJson<T extends GenericJson>(
  data: any
): T | null {
  try {
    return JSON.parse(data);
  } catch (_) {
    return null;
  }
}
