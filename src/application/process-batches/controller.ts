import { prismaClient } from '@/src/infra/database/prisma/client';
import { Router } from 'express';
import { layout } from '@/src/infra/http/www/templates/layout';
import { header } from '@/src/infra/http/www/templates/header';
import { batchAnalyserPage } from '@/src/infra/http/www/templates/pages/batch-analyser';
import { userAuthenticated } from '../users/middlewares/user-authenticated';
import { type GenericJson } from '@/src/infra/http/types/generic-json';

export const processBatchesController = Router();

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
      request: batch.request as GenericJson | null,
      response: batch.response as GenericJson | null,
      error: batch.error as GenericJson | null
    }));

    return res.renderTemplate(
      layout({
        header: header(),
        body: batchAnalyserPage(batch)
      })
    );
  });
