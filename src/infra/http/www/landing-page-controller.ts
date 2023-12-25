import { Router } from 'express';
import { landingPage } from './templates/pages/landing-page';
import { getNewsFeed } from '@/src/application/news/queries/get-news-feed';

export const landingPageController = Router();

landingPageController.get('/', async (req, res) => {
  const news = await getNewsFeed({
    cursor: new Date(),
    limit: 20,
    profileId: '626eeb86-47bd-4dbe-8e58-825a2aa6d7b8'
  });

  res.renderTemplate(landingPage(news));
});
