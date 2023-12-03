// import { test } from 'node:test'
// import { processingRelationsQueue } from '@/src/application/chat-gpt/queues/processing-relations'
// import { newsCreatedQueue } from '../queues/news-created'
// import assert from 'node:assert'
// import { newsFactory } from '@/src/test-utils/factories/news-factory'
// import { stub } from 'sinon'
// import { newsCreatedConsumer } from '../consumers/news-created'
// import { profileFactory } from '@/src/test-utils/factories/profile-factory'
// import { prismaClient } from '@/src/infra/database/prisma/client'
// import { type Queue } from '@/src/infra/messaging/rabbitmq/queue'

// const waitForQueue = async (queue: Queue) => {
//   while (!await queue.isQueueEmpty()) {
//     await new Promise(resolve => setTimeout(resolve, 100))
//   }
// }

// test.only('news-created consumer', async (t) => {
//   t.signal.dispatchEvent(new Event('end'))
//   const sendToQueueStub = stub(processingRelationsQueue, 'send').callsFake(async () => true)

//   const { link } = await newsFactory.create()
//   const { categories } = await profileFactory.create()

//   await newsCreatedQueue.send({ link })

//   await newsCreatedConsumer.run()

//   await waitForQueue(newsCreatedQueue)

//   await newsCreatedConsumer.stop()

//   await newsCreatedQueue.disconnect()

//   await t.test('creates newsCategories for each category for that news', async (t) => {
//     const newsCategories = new Set(await prismaClient.newsCategory.findMany())
//     const expectedNewsCategories = new Set(
//       categories.map(category => ({
//         batchId: null,
//         newsLink: link,
//         category,
//         related: false,
//         processed: false
//       }))
//     )

//     assert.deepStrictEqual(newsCategories, expectedNewsCategories)
//   })

//   await t.test('sends a message to processing-relations queue', (t) => {
//     assert.deepEqual(sendToQueueStub.getCall(0).args[0], { link })
//   })

//   t.signal.dispatchEvent(new Event('end'))
// })
