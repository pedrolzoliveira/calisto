import { faker } from '@faker-js/faker'
import axios from 'axios'
import assert from 'node:assert'
import { stub } from 'sinon'
import test from 'node:test'
import { sourceFactory } from '@/src/test-utils/factories/source-factory'
import { Scraper } from './scraper'
import { prismaClient } from '@/src/infra/database/prisma/client'
import { publisher } from '../publisher'

const makeHTML = (title: string) => `<html><meta property="og:title" content="${title}"></html>`

test('scraper', async (t) => {
  const axiosGetStub = stub(axios, 'get').callsFake(async () => ({ data: makeHTML(title) }))
  const publisherStub = stub(publisher, 'publish')

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
    assert.ok(publisherStub.calledOnce)
    assert.deepStrictEqual(publisherStub.getCall(0).args[0], 'news-created')
    assert.deepStrictEqual(publisherStub.getCall(0).args[1], { link })
  })

  await t.test('when news is already created', async (t) => {
    axiosGetStub.resetHistory()

    await scraper.scrape()

    await t.test('should return early', async () => {
      assert.ok(axiosGetStub.notCalled)
    })
  })

  await t.test('when news is in blacklist', async (t) => {
    axiosGetStub.resetHistory()
    publisherStub.resetHistory()

    const blackListSubdomain = faker.internet.domainName()

    const scraper = new Scraper({
      sourceCode,
      blackList: [blackListSubdomain],
      getLinks: async () => [`https://${blackListSubdomain}.somethig-else.com`],
      getContent: () => content
    })

    await scraper.scrape()

    await t.test('should not scrape the link', async () => {
      assert.ok(axiosGetStub.notCalled)
    })

    await t.test('should not send news to queue', async () => {
      assert.ok(publisherStub.notCalled)
    })
  })
})
