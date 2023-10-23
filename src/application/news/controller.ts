import { Router } from 'express'
import { z } from 'zod'
import { getNewsFeed } from './queries/get-news-feed'
import { prismaClient } from '@/src/infra/database/prisma/client'
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
    profileId: z.string().uuid(),
    'lazy-loaded': z.boolean({ coerce: true }).optional()
  }).parse(req.query)

  const news = await getNewsFeed(data)

  res.setHeader('HX-Push-Url', `/news?profileId=${data.profileId}`)
  return res.render('partials/news-feed', { news, profileId: data.profileId, lazyLoaded: data['lazy-loaded'], layout: false })
})
