import { isWithinTokenLimit } from 'gpt-tokenizer/cjs/model/gpt-3.5-turbo'
import { type CreateChatCompletionRequest, type ChatCompletionRequestMessage, type CreateChatCompletionResponse } from 'openai'
import { ZodError, z } from 'zod'

import { createMessages } from '../prompts/categorize'
import { openai } from '../client'
import { MODELS } from '../models'
import { logger } from '@/src/infra/logger'
import { AxiosError, type AxiosResponse } from 'axios'
import { type PrismaTransaction } from '@/src/infra/database/prisma/types/transaction'

interface RelateCategoriesParams {
  batchId: string
  content: string
  categories: string[]
  transaction: PrismaTransaction
}

const createChatCompletionRequest = (messages: ChatCompletionRequestMessage[], categories: string[]) => {
  const maxResponseLength = (categories.length * 2) + 2

  return {
    model: isWithinTokenLimit(messages, MODELS.GPT_3_5_TURBO.limit - maxResponseLength)
      ? MODELS.GPT_3_5_TURBO.name
      : MODELS.GPT_3_5_TURBO_16K.name,
    messages,
    temperature: 0,
    max_tokens: maxResponseLength,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  } satisfies CreateChatCompletionRequest
}

const getCategoriesFromResponse = (response: AxiosResponse<CreateChatCompletionResponse, any>, categories: string[]): string[] => {
  return z.number().array().parse(
    JSON.parse(response.data.choices[0].message?.content ?? '')
  ).map(index => categories[index])
}

export const relateCategories = async ({ batchId, content, categories, transaction }: RelateCategoriesParams): Promise<string[] | null> => {
  if (!categories.length) {
    return []
  }

  const messages = createMessages(content, categories)

  const chatCompletionRequest = createChatCompletionRequest(messages, categories)

  try {
    const response = await openai.createChatCompletion(chatCompletionRequest) as AxiosResponse<CreateChatCompletionResponse, any>

    await transaction.processBatch.update({
      data: {
        request: chatCompletionRequest as any,
        response: response.data as any
      },
      where: { id: batchId }
    })

    return getCategoriesFromResponse(response, categories)
  } catch (error) {
    logger.error(`(batch: ${batchId}): error relating categories`)
    if (error instanceof AxiosError) {
      logger.error(`(batch: ${batchId}): error when making request to OpenAI API`)
      await transaction.processBatch.update({
        data: {
          request: chatCompletionRequest as any,
          response: error.response?.data,
          error: error.toJSON()
        },
        where: { id: batchId }
      })
    } else if (error instanceof ZodError) {
      logger.error(`(batch: ${batchId}): error parsing response from OpenAI API`)
      await transaction.processBatch.update({
        data: { error: error.format() },
        where: { id: batchId }
      })
    } else {
      logger.error(`(batch: ${batchId}): unknown error`)
      await transaction.processBatch.update({
        data: { error: (error as Error).message },
        where: { id: batchId }
      })
    }

    return null
  }
}
