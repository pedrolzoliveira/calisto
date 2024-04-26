import { schedule } from 'node-cron';
import { emailsQueue } from '../application/emails/queues/emails';
import { newsCreatedQueue } from '../application/news/queues/news-created';
import { cnnBrasilScraper } from '../application/news/scrapers/cnn-brasil-scraper';
import { estadaoScraper } from '../application/news/scrapers/estadao-scraper';
import { folhaScraper } from '../application/news/scrapers/folha-scraper';
import { g1Scraper } from '../application/news/scrapers/g1-scraper';
import { infoMoneyScraper } from '../application/news/scrapers/info-money-scraper';
import { interceptBrasilScraper } from '../application/news/scrapers/intercept-brasil-scraper';
import { metropolesScraper } from '../application/news/scrapers/metropoles-scraper';
import { senadoNoticiasScraper } from '../application/news/scrapers/senado-noticias-scraper';
import { uolScraper } from '../application/news/scrapers/uol-scraper';
import { valorScraper } from '../application/news/scrapers/valor-scraper';
import { calculateCategoriesEmbeddingsQueue } from '../application/profiles/queues/calculate-categories-embeddings';
import { subscriber } from '../infra/database/subscriber';

const QUEUES = {
  emails: emailsQueue,
  'news-created': newsCreatedQueue,
  'calculate-categories-embeddings': calculateCategoriesEmbeddingsQueue
} as const;

const SCRAPERS = {
  'cnn-brasil': cnnBrasilScraper,
  estadao: estadaoScraper,
  folha: folhaScraper,
  g1: g1Scraper,
  infomoney: infoMoneyScraper,
  'intercept-brasil': interceptBrasilScraper,
  metropoles: metropolesScraper,
  'senado-noticias': senadoNoticiasScraper,
  uol: uolScraper,
  valor: valorScraper
} as const;

async function runServices() {
  await subscriber.connect();

  Object.values(QUEUES).map(async (queue) => await queue.consume());

  for (const scraper of Object.values(SCRAPERS)) {
    schedule('* * * * *', () => {
      scraper.scrape();
    }).start();
  }
}

runServices();
