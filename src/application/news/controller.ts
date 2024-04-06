import { Router } from 'express';
import { getNewsFeed } from './queries/get-news-feed';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { layout } from '@/src/infra/http/www/templates/layout';
import { newsPage } from '@/src/infra/http/www/templates/pages/news';
import { header } from '@/src/infra/http/www/templates/header';
import { newsFeed } from '@/src/infra/http/www/templates/components/news-feed';
import { noNewsFound } from '@/src/infra/http/www/templates/components/no-news-found';
import { userAuthenticated } from '../users/middlewares/user-authenticated';
import { loadNew } from './queries/load-new';
import { newNewsLoader } from '@/src/infra/http/www/templates/components/new-news-loader';
import { getNewsRequestSchema } from './zod-schemas';

export const newsController = Router();

newsController.get('/',
  userAuthenticated,
  async (req, res) => {
    const data = getNewsRequestSchema.partial({
      profileId: true
    }).parse(req.query);

    if (!data.profileId) {
      const profile = await prismaClient.profile.findFirst({ select: { id: true }, where: { userId: req.session.user!.id } });
      if (profile) {
        return res.redirect(`?profileId=${profile.id}`);
      }

      return res.renderTemplate(
        layout({
          header: header(),
          body: newsPage({
            news: [],
            profileId: null
          })
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
        header: header({
          profilesData: {
            profiles,
            profileId: data.profileId
          }
        }),
        body: newsPage({
          news,
          profileId: data.profileId
        })
      })
    );
  }
);

newsController.get('/feed',
  userAuthenticated,
  async (req, res) => {
    const data = getNewsRequestSchema.parse(req.query);

    const news = await getNewsFeed(data);

    res.setHeader('HX-Push-Url', `/news?profileId=${data.profileId}`);

    if (!news.length) {
      return res.renderTemplate([
        newNewsLoader({ cursor: data.cursor, profileId: data.profileId }),
        noNewsFound()
      ]);
    }

    return res.renderTemplate([
      newNewsLoader({ cursor: news.at(0)!.createdAt, profileId: data.profileId }),
      ...newsFeed({
        news,
        profileId: data.profileId
      })
    ]);
  });

newsController.get('/load-new',
  userAuthenticated,
  async (req, res) => {
    const data = getNewsRequestSchema.pick({
      profileId: true,
      cursor: true
    }).parse(req.query);

    const news = await loadNew(data);

    return res.renderTemplate(
      newNewsLoader({
        profileId: data.profileId,
        cursor: news.at(0)?.createdAt ?? data.cursor,
        news
      })
    );
  }
);
