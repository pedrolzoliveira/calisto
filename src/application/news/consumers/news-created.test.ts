import { after, before, test } from 'node:test'
import { processingRelationsQueue } from '@/src/application/chat-gpt/queues/processing-relations'
import { newsCreatedQueue } from '../queues/news-created'
import assert from 'node:assert'
import { newsFactory } from '@/src/test-utils/factories/news-factory'
import { stub } from 'sinon'
import { newsCreatedConsumer } from '../consumers/news-created'
import { profileFactory } from '@/src/test-utils/factories/profile-factory'
import { prismaClient } from '@/src/infra/database/prisma/client'
import { type Queue } from '@/src/infra/messaging/rabbitmq/queue'
import { publisher } from '../../publisher'
import { createConnection } from '@/src/infra/messaging/rabbitmq/create-connection'
import { createChannel } from '@/src/infra/messaging/rabbitmq/create-channel'

const sleep = async (ms: number) => await new Promise(resolve => setTimeout(resolve, ms))

const waitForQueue = async (queue: Queue): Promise<any> => {
  await sleep(100)
  if (await queue.getMessageCount()) {
    return await waitForQueue(queue)
  }
}

test.only('news-created consumer', async (t) => {
  const testConnection = await createConnection()
  const testChannel = await createChannel(testConnection)

  await testChannel.purgeQueue('news-created')

  newsCreatedQueue.bindChannel(testChannel)
  newsCreatedConsumer.bindChannel(testChannel)

  const publisherStub = stub(publisher, 'publish')

  const { link } = await newsFactory.create()
  const { categories } = await profileFactory.create()

  const testPublisher = newsCreatedQueue.createPublisher()

  testPublisher.publish('news-created', { link })

  await newsCreatedConsumer.consume()

  await waitForQueue(newsCreatedQueue)

  await newsCreatedConsumer.stop()

  await testChannel.close()
  await testConnection.close()

  await t.test('creates newsCategories for each category for that news', async (t) => {
    const newsCategories = new Set(await prismaClient.newsCategory.findMany())
    const expectedNewsCategories = new Set(
      categories.map(category => ({
        batchId: null,
        newsLink: link,
        category,
        related: false,
        processed: false
      }))
    )

    assert.deepStrictEqual(newsCategories, expectedNewsCategories)
  })

  await t.test('sends a message to processing-relations queue', (t) => {
    assert.deepEqual(publisherStub.getCall(0).args[0], 'processing-relations')
    assert.deepEqual(publisherStub.getCall(0).args[1], { link })
  })
})
