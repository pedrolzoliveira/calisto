import { prismaClient } from '@/src/infra/database/prisma/client'
import { Router } from 'express'
import { processBatchesPage } from '@/src/infra/http/www/templates/pages/process-batchs'
import { tryParseJson } from '@/src/utils/try-parse-json'
import { layout } from '@/src/infra/http/www/templates/layout'
import { header } from '@/src/infra/http/www/templates/header'
import { batchAnalyser } from '@/src/infra/http/www/templates/components/batch-analyser'

export const processBatchesController = Router()

processBatchesController.get('/', async (req, res) => {
  const batch = await prismaClient.processBatch.findFirst()

  if (!batch) {
    throw new Error()
  }

  return res.renderTemplate(
    layout({
      header: header(),
      body: processBatchesPage(tryParseJson(batch.request), tryParseJson(batch.response))
    })

  )
})

processBatchesController.get('/:id', async (req, res) => {
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
    request: tryParseJson(batch.request),
    response: tryParseJson(batch.response),
    error: tryParseJson(batch.error)
  }))

  return res.renderTemplate(
    layout({
      header: header(),
      body: batchAnalyser(batch)
    })
  )
})
