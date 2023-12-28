import { prismaClient } from '@/src/infra/database/prisma/client';
import { Router } from 'express';
import { layout } from '@/src/infra/http/www/templates/layout';
import { header } from '@/src/infra/http/www/templates/header';
import { newsAnalyserPage } from '@/src/infra/http/www/templates/pages/news-analyser';
import { type GenericJson } from '@/src/infra/http/types/generic-json';
import { newsAnalyserFeedPage } from '@/src/infra/http/www/templates/pages/news-analyser-feed';
import { adminAuthenticated } from '../users/middlewares/admin-authenticated';

export const processBatchesController = Router();

processBatchesController.get('/',
  adminAuthenticated,
  async (req, res) => {
    const data = await prismaClient.news.findUniqueOrThrow({
      where: { link: req.query.newsLink as string },
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
        header: header({ isAdmin: true }),
        body: newsAnalyserPage(data)
      })
    );
  });

processBatchesController.get('/news-feed',
  adminAuthenticated,
  async (req, res) => {
    const news = await prismaClient.news.findMany({
      select: {
        link: true,
        title: true,
        description: true,
        content: true,
        imageUrl: true,
        source: true,
        categories: true
      },
      orderBy: { createdAt: 'desc' },
      take: 200
    });

    return res.renderTemplate(
      layout({
        header: header({ isAdmin: true }),
        body: newsAnalyserFeedPage({ news })
      })
    );
  });
