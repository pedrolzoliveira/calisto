import { Router } from 'express'
import { z } from 'zod'
import { getNewsFeed } from './queries/get-news-feed'
import { prismaClient } from '@/src/infra/database/prisma/client'
import { render } from '@lit-labs/ssr'
import { newsCard } from '@/src/infra/http/www/views/partials/news-card'
import { RenderResultReadable } from '@lit-labs/ssr/lib/render-result-readable.js'

export const newsController = Router()

newsController.get('/',
  async (req, res) => {
    const data = z.object({
      limit: z.number({ coerce: true }).default(20),
      cursor: z.date({ coerce: true }).default(new Date()),
      profileId: z.string().uuid().nullable().default(null)
    }).parse(req.query)

    if (!data.profileId) {
      const profile = await prismaClient.profile.findFirst({ select: { id: true } })
      if (profile) {
        return res.redirect(`?profileId=${profile.id}`)
      }

      return res.render('pages/news', { news: [], profiles: [], selectedProfileId: null })
    }

    const [news, profiles] = await Promise.all([
      getNewsFeed({
        limit: data.limit,
        cursor: data.cursor,
        profileId: data.profileId
      }),
      prismaClient.profile.findMany({ select: { id: true, name: true } })
    ])

    return res.render('pages/news', { news, profiles, profileId: data.profileId, showSelectProfiles: true })
  }
)

newsController.get('/feed', async (req, res) => {
  const data = z.object({
    limit: z.number({ coerce: true }).default(20),
    cursor: z.date({ coerce: true }).default(new Date()),
    profileId: z.string().uuid()
  }).parse(req.query)

  const news = await getNewsFeed(data)

  res.setHeader('HX-Push-Url', `/news?profileId=${data.profileId}`)
  return res.render('partials/news-feed', { news, profileId: data.profileId, layout: false })
})

newsController.get('/testing-lit', async (req, res) => {
  const [news] = await getNewsFeed({
    profileId: 'b6394d0f-e3d0-4b3d-8154-b4ae2c54679d',
    limit: 1,
    cursor: new Date()
  })

  const result = render(newsCard(news))

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')

  const readableResult = new RenderResultReadable(result)
  // res.write(readableResult.read())

  res.send(readableResult.read())

  // res.write()
})
