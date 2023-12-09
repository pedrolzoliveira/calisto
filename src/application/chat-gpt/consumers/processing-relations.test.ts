import { createChannel } from '@/src/infra/messaging/rabbitmq/create-channel'
import { createConnection } from '@/src/infra/messaging/rabbitmq/create-connection'
import { after, before, describe, it } from 'node:test'
import { processingRelationsQueue } from '../queues/processing-relations'
import { processingRelationsConsumer } from './processing-relations'
import { type SinonStub, stub } from 'sinon'
import { publisher } from '../../publisher'
import { type Channel, type Connection } from 'amqplib'
import { profileFactory } from '@/src/test-utils/factories/profile-factory'
import { newsFactory } from '@/src/test-utils/factories/news-factory'
import { waitForQueue } from '@/src/test-utils/wait-for-queue'
import { openai } from '../client'
import { type NewsCategory } from '@prisma/client'
import { prismaClient } from '@/src/infra/database/prisma/client'
import assert from 'node:assert'
import { populateNewsCategory } from '../../news/queries/populate-news-category'
import { faker } from '@faker-js/faker'
import { truncateDatabase } from '@/src/test-utils/truncate-database'

describe('processing-relations consumer', async () => {
  let testConnection: Connection
  let testChannel: Channel
  let newsCategories: Set<Partial<NewsCategory>>

  const testPublisher = processingRelationsQueue.createPublisher()

  const newsLink = faker.internet.url()
  const content = faker.lorem.paragraph()
  const categories = Array.from({ length: 2 }, () => faker.lorem.words(3))

  const createChatCompletionResponse = {
    data: {
      choices: [
        { message: { content: '[0,1]' } }
      ]
    }
  }

  before(async () => {
    await truncateDatabase()

    testConnection = await createConnection()
    testChannel = await createChannel(testConnection)
    await testChannel.purgeQueue('processing-relations')

    stub(openai, 'createChatCompletion').returns(createChatCompletionResponse as any)

    processingRelationsQueue.bindChannel(testChannel)
    processingRelationsConsumer.bindChannel(testChannel)
    testPublisher.bindChannel(testChannel)

    await profileFactory.create({ categories })
    await newsFactory.create({ content, link: newsLink })
    await populateNewsCategory(newsLink)

    testPublisher.publish('processing-relations', { link: newsLink })
    await processingRelationsConsumer.consume()
    await waitForQueue(processingRelationsQueue)

    newsCategories = new Set(
      await prismaClient.newsCategory.findMany({
        select: {
          category: true,
          newsLink: true,
          processed: true,
          related: true
        },
        where: { newsLink }
      })
    )
  })

  after(async () => {
    await processingRelationsConsumer.stop()
    await testChannel.close()
    await testConnection.close()
  })

  it('news categories should be processed and related', () => {
    const expectedNewsCategories = new Set(
      categories.map(category => ({
        newsLink,
        category,
        related: true,
        processed: true
      }))
    )
    assert.deepStrictEqual(newsCategories, expectedNewsCategories)
  })

  await describe('when there are more than 20 categories', async () => {
    let publisherStub: SinonStub

    before(async () => {
      publisherStub = stub(publisher, 'publish')

      await profileFactory.create({ categories: Array.from({ length: 21 }, () => faker.lorem.words(3)) })
      await populateNewsCategory(newsLink)

      testPublisher.publish('processing-relations', { link: newsLink })
      await waitForQueue(processingRelationsQueue)
    })

    it('should send a message to processing-relations queue', () => {
      assert.deepEqual(publisherStub.getCall(0).args, ['processing-relations', { link: newsLink }])
    })
  })
})
