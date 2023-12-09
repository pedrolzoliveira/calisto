import { Router } from 'express';
import { z } from 'zod';
import { getNewsFeed } from './queries/get-news-feed';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { layout } from '@/src/infra/http/www/templates/layout';
import { newsPage } from '@/src/infra/http/www/templates/pages/news';
import { header } from '@/src/infra/http/www/templates/header';
import { newsFeed } from '@/src/infra/http/www/templates/components/news-feed';
import { noNewsFound } from '@/src/infra/http/www/templates/components/no-news-found';
import { userAuthenticated } from '../users/middlewares/user-authenticated';

export const newsController = Router();

newsController.get('/',
  userAuthenticated,
  async (req, res) => {
    const data = z.object({
      limit: z.number({ coerce: true }).default(20),
      cursor: z.date({ coerce: true }).default(new Date()),
      profileId: z.string().uuid().nullable().default(null)
    }).parse(req.query);

    if (!data.profileId) {
      const profile = await prismaClient.profile.findFirst({ select: { id: true }, where: { userId: req.session.user!.id } });
      if (profile) {
        return res.redirect(`?profileId=${profile.id}`);
      }

      return res.renderTemplate(
        layout({
          header: header(),
          body: newsPage({ news: [], profileId: null })
        })
      );
    }

    const [news, profiles] = await Promise.all([
      getNewsFeed({
        limit: data.limit,
        cursor: data.cursor,
        profileId: data.profileId
      }),
      prismaClient.profile.findMany({ select: { id: true, name: true }, where: { userId: req.session.user!.id } })
    ]);

    return res.renderTemplate(
      layout({
        header: header({ profiles, profileId: data.profileId }),
        body: newsPage({ news, profileId: data.profileId })
      })
    );
  }
);

newsController.get('/feed',
  userAuthenticated,
  async (req, res) => {
    const data = z.object({
      limit: z.number({ coerce: true }).default(20),
      cursor: z.date({ coerce: true }).default(new Date()),
      profileId: z.string().uuid()
    }).parse(req.query);

    const news = await getNewsFeed(data);

    res.setHeader('HX-Push-Url', `/news?profileId=${data.profileId}`);

    if (!news.length) {
      return res.renderTemplate(
        noNewsFound()
      );
    }

    return res.renderTemplate(
      newsFeed({ news, profileId: data.profileId })
    );
  });
