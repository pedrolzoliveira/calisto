import { prismaClient } from '@/src/infra/database/prisma/client';
import { Router } from 'express';
import { layout } from '@/src/infra/http/www/templates/layout';
import { header } from '@/src/infra/http/www/templates/header';
import { batchAnalyserPage } from '@/src/infra/http/www/templates/pages/batch-analyser';
import { userAuthenticated } from '../users/middlewares/user-authenticated';
import { type GenericJson } from '@/src/infra/http/types/generic-json';

export const processBatchesController = Router();

processBatchesController.get('/',
  userAuthenticated,
  async (req, res) => {
    const data = await prismaClient.news.findUniqueOrThrow({
      where: { link: req.query.newsLink },
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
        },
        batches: {
          select: {
            id: true,
            request: true,
            response: true,
            error: true,
            categories: {
              select: {
                category: true,
                related: true
              }
            }
          }
        }
      }
    }).then(data => ({
      news: {
        link: data.link,
        title: data.title,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt.toISOString(),
        source: data.source
      },
      batches: data.batches.map(batch => ({
        id: batch.id,
        request: batch.request as GenericJson | null,
        response: batch.response as GenericJson | null,
        error: batch.error as GenericJson | null,
        categories: batch.categories
      }))
    }));

    return res.renderTemplate(
      layout({
        header: header(),
        body: batchAnalyserPage(data)
      })
    );
  });
