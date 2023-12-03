import { faker } from '@faker-js/faker'
import axios from 'axios'
import assert from 'node:assert'
import { type SinonStub, stub } from 'sinon'
import { before, describe, it } from 'node:test'
import { sourceFactory } from '@/src/test-utils/factories/source-factory'
import { Scraper } from './scraper'
import { prismaClient } from '@/src/infra/database/prisma/client'
import { publisher } from '../publisher'
import { type News } from '@prisma/client'

const makeHTML = (title: string) => `<html><meta property="og:title" content="${title}"></html>`

describe('scraper', async () => {
  let axiosGetStub: SinonStub
  let publisherStub: SinonStub
  let news: News | null

  const sourceCode = faker.word.words()
  const link = faker.internet.url()
  const title = faker.lorem.sentence()
  const content = faker.lorem.paragraph()

  const scraper = new Scraper({
    sourceCode,
    getLinks: async () => [link],
    getContent: () => content
  })

  before(async () => {
    axiosGetStub = stub(axios, 'get').callsFake(async () => ({ data: makeHTML(title) }))
    publisherStub = stub(publisher, 'publish')

    await sourceFactory.create({ code: sourceCode })

    await scraper.scrape()

    news = await prismaClient.news.findFirst({ where: { link } })
  })

  it('should create news with right values', () => {
    assert.ok(news)
    assert.strictEqual(news?.title, title)
    assert.strictEqual(news?.content, content)
  })

  it('should send news to queue', () => {
    assert.deepStrictEqual(publisherStub.getCall(0).args, ['news-created', { link }])
  })

  describe('when news is already created', async () => {
    before(async () => {
      axiosGetStub.resetHistory()
      await scraper.scrape()
    })

    it('should return early', () => {
      assert.ok(axiosGetStub.notCalled)
    })
  })

  describe('when news is in blacklist', async () => {
    before(async () => {
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
    })

    it('should not scrape the link', () => {
      assert.ok(axiosGetStub.notCalled)
    })

    it('should not send news to queue', () => {
      assert.ok(publisherStub.notCalled)
    })
  })
})
