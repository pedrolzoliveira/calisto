import { prismaClient } from '@/src/infra/database/prisma/client'
import { Router } from 'express'
import { layout } from '@/src/infra/http/www/templates/layout'
import { header } from '@/src/infra/http/www/templates/header'
import { tryParseJson } from '@/src/utils/try-parse-json'
import { batchAnalyserPage } from '@/src/infra/http/www/templates/pages/batch-analyser'
import { userAuthenticated } from '../users/middlewares/user-authenticated'

export const processBatchesController = Router()

processBatchesController.get('/:id',
  userAuthenticated,
  async (req, res) => {
    const batch = await prismaClient.processBatch.findUniqueOrThrow({
      where: { id: req.params.id },
      select: {
        id: true,
        request: true,
        response: true,
        error: true,
        news: {
          select: {
            link: true,
            title: true,
            description: true,
            content: true,
            imageUrl: true,
            createdAt: true,
            source: {
              select: {
                name: true,
                avatarUrl: true
              }
            }
          }
        },
        categories: {
          select: {
            category: true,
            related: true
          }
        }
      }
    }).then(batch => ({
      ...batch,
      news: {
        ...batch.news,
        createdAt: batch.news.createdAt.toISOString()
      },
      request: tryParseJson(batch.request),
      response: tryParseJson(batch.response),
      error: tryParseJson(batch.error)
    }))

    return res.renderTemplate(
      layout({
        header: header(),
        body: batchAnalyserPage(batch)
      })
    )
  })
