import { Router } from 'express';
import { newsController } from './news/controller';
import { profilesController } from './profiles/controller';
import { usersController } from './users/controller';
import { getNewsFeed } from './news/queries/get-news-feed';
import { landingPage } from '../infra/http/www/templates/pages/landing-page';
import { learnMorePage } from '../infra/http/www/templates/pages/learn-more';

export const applicationController = Router();

applicationController.use('/news', newsController);
applicationController.use('/profiles', profilesController);
applicationController.use('/users', usersController);

applicationController.get('/', async (req, res) => {
  const news = await getNewsFeed({
    cursor: new Date(),
    limit: 20,
    profileId: '626eeb86-47bd-4dbe-8e58-825a2aa6d7b8'
  });

  return res.renderTemplate(landingPage(news));
});

applicationController.get('/learn-more', (req, res) => {
  return res.renderTemplate(learnMorePage());
});
