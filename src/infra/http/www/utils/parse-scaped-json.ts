import { type GenericJson } from '../../types/generic-json'

const unescapeHtml = (str: string): string => {
  const replacements = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  } as const

  return str.replace(
    /&amp;|&lt;|&gt;|&quot;|&#39;/g,
    (entity) => replacements[entity as keyof typeof replacements]
  )
}

export function parseScapedJson(json: string): GenericJson {
  return JSON.parse(
    unescapeHtml(json)
  )
}
