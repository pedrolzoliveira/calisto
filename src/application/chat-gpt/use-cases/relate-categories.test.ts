import { relateCategories } from './relate-categories'
import { before, describe, it } from 'node:test'
import { stub, type SinonStub } from 'sinon'
import { openai } from '../client'
import { type ProcessBatch, type News } from '@prisma/client'
import { processBatchFactory } from '@/src/test-utils/factories/process-batch-factory'
import { profileFactory } from '@/src/test-utils/factories/profile-factory'
import { newsFactory } from '@/src/test-utils/factories/news-factory'
import { prismaClient } from '@/src/infra/database/prisma/client'
import assert from 'node:assert'
import { MODELS } from '../models'
import { createMessages } from '../prompts/categorize'

describe('relate-categories', async () => {
  const categories = ['any_categories', 'other_categories', 'more_categories']
  const expectedCategories = [categories[0], categories[2]]
  const content = 'news content'

  let news: News
  let batch: ProcessBatch
  let openaiStub: SinonStub
  let relatedCategories: string[]

  const chatCompletionRequest = {
    model: MODELS.GPT_3_5_TURBO.name,
    messages: createMessages(content, categories),
    temperature: 0,
    max_tokens: (categories.length * 2) + 2,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  }

  const chatCompletionResponse = {
    data: {
      choices: [
        { message: { content: JSON.stringify([0, 2]) } }
      ]
    }
  }

  before(async () => {
    [news] = await Promise.all([
      newsFactory.create({ content }),
      profileFactory.create({ categories })
    ])
    batch = await processBatchFactory.create({ newsLink: news.link })

    openaiStub = stub(openai, 'createChatCompletion').returns(chatCompletionResponse as any)

    relatedCategories = await relateCategories({
      batchId: batch.id,
      content,
      categories,
      transaction: prismaClient
    }) as string[]

    batch = await prismaClient.processBatch.findUniqueOrThrow({ where: { id: batch.id } })
  })

  it('should call openai.createChatCompletion with the correct parameters', () => {
    assert.deepStrictEqual(
      openaiStub.getCall(0).args,
      [chatCompletionRequest]
    )
  })

  it('should return the related categories', () => {
    assert.deepStrictEqual(relatedCategories, expectedCategories)
  })

  it('should update the batch with the request and response', () => {
    const { request, response } = batch
    assert.deepStrictEqual(request, chatCompletionRequest)
    assert.deepStrictEqual(response, chatCompletionResponse.data)
  })

  // #todo: implement the other cases

  // describe('when we got an error from openai', () => {})

  // describe('when we got an error parsing the response', () => {})

  // describe('when we got an unknown error', () => {})
})
