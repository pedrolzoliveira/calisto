import { Router } from 'express';
import { newsController } from './news/controller';
import { profilesController } from './profiles/controller';
import { usersController } from './users/controller';
import { landingPage } from '../infra/http/www/templates/pages/landing-page';
import { learnMorePage } from '../infra/http/www/templates/pages/learn-more';
import { prismaClient } from '../infra/database/prisma/client';
import { logger } from '../infra/logger';
import { getNews } from './news/queries/get-news';
import { newsCard } from '../infra/http/www/templates/components/news-card';
import { DateTime } from 'luxon';

export const applicationController = Router();

applicationController.use('/news', newsController);
applicationController.use('/profiles', profilesController);
applicationController.use('/users', usersController);

applicationController.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/news');
  }

  return res.redirect('/landing-page');
});

applicationController.get('/landing-page', (req, res) => {
  return res.renderTemplate(landingPage());
});

applicationController.get('/fetch-landing-page-news', async (req, res) => {
  let news: Awaited<ReturnType<typeof getNews>>;

  try {
    const { id: profileId, userId } = await prismaClient.profile.findFirstOrThrow({
      select: { id: true, userId: true },
      where: {
        user: { role: 'admin' }
      },
      orderBy: { name: 'asc' }
    });

    news = await getNews({
      limit: 20,
      profileId,
      userId,
      cursor: { lower: DateTime.now().minus({ days: 3 }).toJSDate() }
    });
  } catch (error) {
    logger.error(error);
    news = [];
  }

  return res.renderTemplate(news.map(newsCard));
});

applicationController.get('/learn-more', async (req, res) => {
  let sources: string[];

  try {
    sources = (
      await prismaClient.source.findMany({
        select: { name: true }
      })
    ).map(({ name }) => name);
  } catch (error) {
    logger.error(error);
    sources = [];
  }

  return res.renderTemplate(learnMorePage(sources));
});
