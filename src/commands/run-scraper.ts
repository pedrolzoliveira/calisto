import { schedule } from 'node-cron';

import { estadaoScraper } from '../application/news/scrapers/estadao-scraper';
import { folhaScraper } from '../application/news/scrapers/folha-scraper';
import { g1Scraper } from '../application/news/scrapers/g1-scraper';
import { uolScraper } from '../application/news/scrapers/uol-scraper';
import { valorScraper } from '../application/news/scrapers/valor-scraper';
import { publisher } from '../application/publisher';
import { createChannel } from '../infra/messaging/rabbitmq/create-channel';
import { createConnection } from '../infra/messaging/rabbitmq/create-connection';
import { cnnBrasilScraper } from '../application/news/scrapers/cnn-brasil-scraper';

createConnection()
  .then(connection => {
    createChannel(connection)
      .then(channel => {
        publisher.bindChannel(channel);

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

        schedule('* * * * *', () => {
          cnnBrasilScraper.scrape();
        }).start();
      });
  });
