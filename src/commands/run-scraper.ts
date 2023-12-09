import { schedule } from 'node-cron';

import { estadaoScraper } from '../application/news/scrapers/estadao-scraper';
import { folhaScraper } from '../application/news/scrapers/folha-scraper';
import { g1Scraper } from '../application/news/scrapers/g1-scraper';
import { uolScraper } from '../application/news/scrapers/uol-scraper';
import { valorScraper } from '../application/news/scrapers/valor-scraper';

schedule('* * * * *', () => {
  estadaoScraper.scrape();
}).start();

schedule('* * * * *', () => {
  folhaScraper.scrape();
}).start();

schedule('* * * * *', () => {
  g1Scraper.scrape();
}).start();

schedule('* * * * *', () => {
  uolScraper.scrape();
}).start();

schedule('* * * * *', () => {
  valorScraper.scrape();
}).start();
