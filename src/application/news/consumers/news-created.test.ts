import { after, before, describe, it } from 'node:test'
import { newsCreatedQueue } from '../queues/news-created'
import assert from 'node:assert'
import { newsFactory } from '@/src/test-utils/factories/news-factory'
import { type SinonStub, stub } from 'sinon'
import { newsCreatedConsumer } from '../consumers/news-created'
import { profileFactory } from '@/src/test-utils/factories/profile-factory'
import { prismaClient } from '@/src/infra/database/prisma/client'
import { publisher } from '../../publisher'
import { createConnection } from '@/src/infra/messaging/rabbitmq/create-connection'
import { createChannel } from '@/src/infra/messaging/rabbitmq/create-channel'
import { type Channel, type Connection } from 'amqplib'
import { type NewsCategory } from '@prisma/client'
import { waitForQueue } from '@/src/test-utils/wait-for-queue'

describe('news-created consumer', async () => {
  let testConnection: Connection
  let testChannel: Channel
  let publisherStub: SinonStub
  let link: string
  let categories: string[]
  let newsCategories: Set<NewsCategory>
  let expectedNewsCategories: Set<NewsCategory>

  before(async () => {
    testConnection = await createConnection()
    testChannel = await createChannel(testConnection)

    await testChannel.purgeQueue('news-created')

    newsCreatedQueue.bindChannel(testChannel)
    newsCreatedConsumer.bindChannel(testChannel)

    const testPublisher = newsCreatedQueue.createPublisher()

    publisherStub = stub(publisher, 'publish')

    const news = await newsFactory.create()
    const profile = await profileFactory.create()

    link = news.link
    categories = profile.categories

    testPublisher.publish('news-created', { link })

    await newsCreatedConsumer.consume()

    await waitForQueue(newsCreatedQueue)

    newsCategories = new Set(await prismaClient.newsCategory.findMany())
    expectedNewsCategories = new Set(
      categories.map(category => ({
        batchId: null,
        newsLink: link,
        category,
        related: false,
        processed: false
      }))
    )
  })

  after(async () => {
    await newsCreatedConsumer.stop()
    await testChannel.close()
    await testConnection.close()
  })

  it('creates newsCategories for each category for that news', () => {
    assert.deepStrictEqual(newsCategories, expectedNewsCategories)
  })

  it('sends a message to processing-relations queue', () => {
    assert.deepEqual(publisherStub.getCall(0).args, ['processing-relations', { link }])
  })
})
