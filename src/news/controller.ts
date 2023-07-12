import { prismaClient } from '@/prisma/client'
import { Router } from 'express'
import { z } from 'zod'

export const newsController = Router()

newsController.get('/',
  async (req, res) => {
    const data = z.object({
      limit: z.number({ coerce: true }).default(20),
      skip: z.number({ coerce: true }).default(0)
    }).parse(req.query)

    const news = await prismaClient.news.findMany({
      skip: data.skip,
      take: data.limit,
      select: {
        source: true,
        link: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return res.status(200).send({
      count: news.length,
      news
    })
  }
)
