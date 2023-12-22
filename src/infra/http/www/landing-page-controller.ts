import { Router } from 'express';
import { landingPage } from './templates/landing-page';

export const landingPageController = Router();

landingPageController.get('/', (req, res) => {
  res.renderTemplate(landingPage());
});
