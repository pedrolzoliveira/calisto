import { Router } from 'express';
import { newsController } from './news/controller';
import { profilesController } from './profiles/controller';
import { usersController } from './users/controller';
import { getNewsFeed } from './news/queries/get-news-feed';
import { landingPage } from '../infra/http/www/templates/pages/landing-page';
import { learnMorePage } from '../infra/http/www/templates/pages/learn-more';
import { prismaClient } from '../infra/database/prisma/client';
import { logger } from '../infra/logger';

export const applicationController = Router();

applicationController.use('/news', newsController);
applicationController.use('/profiles', profilesController);
applicationController.use('/users', usersController);

applicationController.get('/', async (req, res) => {
  let news: Awaited<ReturnType<typeof getNewsFeed>>;

  try {
    const { id: profileId } = await prismaClient.profile.findFirstOrThrow({
      select: { id: true },
      where: {
        user: { role: 'admin' }
      },
      orderBy: { name: 'asc' }
    });

    news = await getNewsFeed({
      cursor: new Date(),
      limit: 20,
      profileId
    });
  } catch (error) {
    logger.error(error);
    news = [];
  }

  return res.renderTemplate(landingPage(news));
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
