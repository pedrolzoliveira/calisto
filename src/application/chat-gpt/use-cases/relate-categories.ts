import { isWithinTokenLimit } from 'gpt-tokenizer/cjs/model/gpt-3.5-turbo'
import { type CreateChatCompletionRequest, type ChatCompletionRequestMessage, CreateChatCompletionResponse } from 'openai'
import { ZodError, z } from 'zod'

import categorizePrompt from '../prompts/categorize'
import { openai } from '../client'
import { MODELS } from '../models'
import { logger } from '@/src/infra/logger'
import { AxiosError, AxiosResponse } from 'axios'
import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space'
import { PrismaTransaction } from '@/src/infra/database/prisma/types/transaction'

interface RelateCategoriesParams {
  batchId: string
  content: string
  categories: string[]
  transaction: PrismaTransaction
}

const createMessages = (content: string, categories: string[]) => {
  return [
    {
      role: 'system',
      content: "Relate the categories with the user's given text. Use the index of the last user's message's categories to relate and return a valid JSON. If no category relates to the text, return an empty list."
    },
    {
      role: 'user',
      content: 'text:\nastronautas vão em missão interestelar para encontrar novo planeta habitável e salvar a humanidade da crise climática e da extinção.\ncategories:\n["Crise climática", "Bitcoin", "Viagem espacial"]'
    },
    {
      role: 'assistant',
      content: '[0,2]'
    },
    {
      role: 'user',
      content: categorizePrompt
        .replace('{text}', sanitizeWhiteSpace(content))
        .replace('{categories}', JSON.stringify(categories))
    }
  ] satisfies ChatCompletionRequestMessage[]
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
      data: { request: JSON.stringify(chatCompletionRequest), response: JSON.stringify(response.data) },
      where: { id: batchId }
    })

    return getCategoriesFromResponse(response, categories)
  } catch(error) {
    logger.error(`(batch: ${batchId}): error relating categories`)
    if (error instanceof AxiosError) {
      logger.error(`(batch: ${batchId}): error when making request to OpenAI API`)
      await transaction.processBatch.update({
        data: {
          request: JSON.stringify(chatCompletionRequest),
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
