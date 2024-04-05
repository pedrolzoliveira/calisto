import { Router } from 'express';
import { newsController } from './news/controller';
import { profilesController } from './profiles/controller';
import { usersController } from './users/controller';
import { getNewsFeed } from './news/queries/get-news-feed';
import { landingPage } from '../infra/http/www/templates/pages/landing-page';
import { learnMorePage } from '../infra/http/www/templates/pages/learn-more';
import { prismaClient } from '../infra/database/prisma/client';

export const applicationController = Router();

applicationController.use('/news', newsController);
applicationController.use('/profiles', profilesController);
applicationController.use('/users', usersController);

applicationController.get('/', async (req, res) => {
  const news = await getNewsFeed({
    cursor: new Date(),
    limit: 20,
    profileId: '98d0f2c9-da27-4ff3-bb8a-950ceeca1023'
  });

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
  } catch (_) {
    sources = [];
  }

  return res.renderTemplate(learnMorePage(sources));
});
