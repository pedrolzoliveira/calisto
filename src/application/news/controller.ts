import { Router } from 'express';
import { prismaClient } from '@/src/infra/database/prisma/client';
import { layout } from '@/src/infra/http/www/templates/layout';
import { newsPage } from '@/src/infra/http/www/templates/pages/news';
import { header } from '@/src/infra/http/www/templates/header';
import { userAuthenticated } from '../users/middlewares/user-authenticated';
import { fetchNewsRequestSchema, getNewsRequestSchema } from './zod-schemas';
import { getNews } from './queries/get-news';
import { newsCard } from '@/src/infra/http/www/templates/components/news-card';
import { newsPuller } from '@/src/infra/http/www/templates/components/news-puller';
import { newsLazyLoader } from '@/src/infra/http/www/templates/components/news-lazy-loader';
import { UNIX_EPOCH_START_DATE } from './constants';

export const newsController = Router();

newsController.get('/',
  userAuthenticated,
  async (req, res) => {
    const validation = getNewsRequestSchema.partial({
      profileId: true
    }).safeParse(req.query);

    if (!validation.success) {
      return res.redirect('/news');
    }

    const data = validation.data;

    if (!data.profileId) {
      const cookieProfileId = req.cookies.profileId
        ? String(req.cookies.profileId)
        : undefined;

      const profile = await prismaClient.profile.findFirst({
        select: { id: true },
        where: {
          ...(cookieProfileId && { id: cookieProfileId }),
          userId: req.session.user!.id
        }
      });

      if (profile) {
        return res.redirect(`?profileId=${profile.id}`);
      }

      if (cookieProfileId) {
        res.clearCookie('profileId');
        return res.redirect('/news');
      }

      return res.redirect('/profiles/new?firstProfile=true');
    }

    const belongsToUser = Boolean(
      await prismaClient.profile.findFirst({
        select: { id: true },
        where: {
          id: data.profileId,
          userId: req.session.user!.id
        }
      })
    );

    if (!belongsToUser) {
      return res.redirect('/news');
    }

    const profiles = await prismaClient.profile.findMany({ select: { id: true, name: true }, where: { userId: req.session.user!.id } });

    return res.renderTemplate(
      layout({
        header: header({
          profilesData: {
            profiles,
            profileId: data.profileId
          }
        }),
        body: newsPage({
          profileId: data.profileId
        })
      })
    );
  }
);

newsController.get('/fetch',
  userAuthenticated,
  async (req, res) => {
    const data = fetchNewsRequestSchema.parse(req.query);

    const news = await getNews({
      limit: data.limit,
      cursor: { upper: data.cursorUpper, lower: data.cursorLower },
      profileId: data.profileId,
      userId: req.session.user!.id
    });

    const newsCards = news.map(newsCard);

    res.setHeader('HX-Push-Url', `/news?profileId=${data.profileId}`);

    if (data.addPulling) {
      newsCards.unshift(
        newsPuller({
          profileId: data.profileId,
          cursorLower: news.at(0)?.createdAt ?? data.cursorLower
        })
      );
    }

    if (data.addLazyLoading && (news.length === data.limit || data.cursorLower.getTime() !== UNIX_EPOCH_START_DATE.getTime())) {
      newsCards.push(
        newsLazyLoader({
          profileId: data.profileId,
          limit: data.limit,
          cursorUpper: news.at(-1)?.createdAt ?? data.cursorUpper
        })
      );
    }

    return res.renderTemplate(newsCards);
  }
);
