import { tryParseJson } from '@/src/utils/try-parse-json'
import { type ProcessBatch } from '@prisma/client'

export const processBatchFormatter = <T extends Partial<ProcessBatch>>(data: T) => {
  return {
    ...data,
    request: tryParseJson(data.request),
    response: tryParseJson(data.response),
    error: tryParseJson(data.error)
  }
}
