import { isWithinTokenLimit } from 'gpt-tokenizer/cjs/model/gpt-3.5-turbo'
import { type CreateChatCompletionRequest, type ChatCompletionRequestMessage } from 'openai'
import { z } from 'zod'

import categorizePrompt from '../prompts/categorize'
import { openai } from '../client'
import { MODELS } from '../models'
import { filterContent } from '../utils/filter-content'
import { logger } from '@/src/infra/logger'
import { AxiosError } from 'axios'

export const relateCategories = async (content: string, categories: string[]) => {
  if (!categories.length) {
    return []
  }

  const maxResponseLength = (categories.length * 2) + 2

  const messages = [
    {
      role: 'system',
      content: "Relate the categories with the user's given text. Use the index of the last user's message's categories to relate and return a valid JSON. If there's no category related to the text, return an empty list."
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
        .replace('{text}', filterContent(content))
        .replace('{categories}', JSON.stringify(categories))
    }
  ] satisfies ChatCompletionRequestMessage[]

  const createChatCompletionRequest = {
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

  const response = await openai.createChatCompletion(createChatCompletionRequest).catch(error => {
    if (error instanceof AxiosError) {
      logger.error({ error, request: createChatCompletionRequest, response: error.response?.data })
    } else {
      logger.error({ error, request: createChatCompletionRequest })
    }
    throw error
  })

  try {
    return z.number().array().parse(
      JSON.parse(response.data.choices[0].message?.content ?? '')
    ).map(index => categories[index])
  } catch (error) {
    logger.error({ error, request: createChatCompletionRequest, response: response.data })
    throw error
  }
}
