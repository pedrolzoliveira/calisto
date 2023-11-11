import { faker } from "@faker-js/faker"
import axios from "axios"
import assert from "node:assert"
import test from "node:test"
import { sourceFactory } from "@/src/test-utils/factories/source-factory"
import { Scraper } from "./scraper"
import { prismaClient } from "@/src/infra/database/prisma/client"
import { newsCreatedQueue } from '@/src/application/news/queues/news-created'

const makeHTML = (title: string) => `<html><meta property="og:title" content="${title}"></html>`

test('scraper', async (t) => {
  const axiosGetMock = t.mock.method(axios, 'get', async () => ({ data: makeHTML(title) }))
  const sendToQueueMock = t.mock.method(newsCreatedQueue, 'send', async () => {})
  
  const sourceCode = faker.word.words()
  const link = faker.internet.url()
  const title = faker.lorem.sentence()
  const content = faker.lorem.paragraph()

  await sourceFactory.create({ code: sourceCode })
  
  const scraper = new Scraper({
    sourceCode,
    getLinks: async () => [link],
    getContent: () => content
  })

  await scraper.scrape()

  const news = await prismaClient.news.findFirst({ where: { link } })
  
  await t.test('should create news with right values', () => {
    assert.ok(news)
    assert.strictEqual(news?.title, title)
    assert.strictEqual(news?.content, content)
  })

  await t.test('should send news to queue', () => {
    assert.strictEqual(sendToQueueMock.mock.callCount(), 1)
    assert.deepStrictEqual(sendToQueueMock.mock.calls[0].arguments[0], { link })
  })

  await t.test('when news is already created', async (t) => {
    axiosGetMock.mock.resetCalls()

    await scraper.scrape()

    await t.test('should return early', async () => {
      assert.strictEqual(axiosGetMock.mock.callCount(), 0)
    })
  })

  await t.test('when news is in blacklist', async (t) => {
    axiosGetMock.mock.resetCalls()
    sendToQueueMock.mock.resetCalls()

    const blackListSubdomain = faker.internet.domainName()

    const scraper = new Scraper({
      sourceCode,
      blackList: [blackListSubdomain],
      getLinks: async () => [`https://${blackListSubdomain}.somethig-else.com`],
      getContent: () => content
    })

    await scraper.scrape()

    await t.test('should not scrape the link', async () => {
      assert.strictEqual(axiosGetMock.mock.callCount(), 0)
    })

    await t.test('should not send news to queue', async () => {
      assert.strictEqual(sendToQueueMock.mock.callCount(), 0)
    })
  })
})