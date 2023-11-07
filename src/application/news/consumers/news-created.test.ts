import { test } from 'node:test'

import { processingRelationsQueue } from '@/src/application/chat-gpt/queues/processing-relations'
import { newsCreatedQueue } from '../queues/news-created'
import assert from 'node:assert'
import { sourceFactory } from '@/src/test-utils/factories/source-factory'
import { newsFactory } from '@/src/test-utils/factories/news-factory'

import '../consumers/news-created'
import { faker } from '@faker-js/faker'
import { profileFactory } from '@/src/test-utils/factories/profile-factory'
import { prismaClient } from '@/src/infra/database/prisma/client'

test.only('news-created consumer', async (t) => {
	const link = faker.internet.url()

	const sendToQueueMock = t.mock.method(processingRelationsQueue, 'send', async () => ({ link }))

	const { code: sourceCode } = await sourceFactory.create()
	
	await newsFactory.create({ sourceCode, link })

	const { categories } = await profileFactory.create()

	await newsCreatedQueue.send({ link })

	await new Promise((resolve) => setTimeout(resolve, 1000))

	await t.test('creates newsCategories for each category for that news', async (t) => {
		// const newsCategories = await prismaClient.newsCategory.findMany({ where: { newsLink: link }})
		const newsCategories = await prismaClient.newsCategory.findMany()

		console.log(newsCategories)
		assert.deepStrictEqual(newsCategories, categories.map(category => ({ newsLink: link, category, related: false, processed: false })))
	})

	await t.test('sends a message to processing-relations queue', async (t) => {
		assert.strictEqual(sendToQueueMock.mock.callCount(), 1)
		assert.deepStrictEqual(sendToQueueMock.mock.calls[0].arguments[0], { link })
	})
})