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
import { metropolesScraper } from '../application/news/scrapers/metropoles-scraper';
import { senadoNoticiasScraper } from '../application/news/scrapers/senado-noticias-scraper';
import { interceptBrasilScraper } from '../application/news/scrapers/intercept-brasil-scraper';
import { infoMoneyScraper } from '../application/news/scrapers/info-money-scraper';

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

function runAll() {
  for (const scraper of Object.values(SCRAPERS)) {
    schedule('* * * * *', () => {
      scraper.scrape();
    }).start();
  }
}

async function runScraper(args: string[]) {
  const connection = await createConnection();
  const channel = await createChannel(connection);
  publisher.bindChannel(channel);

  if (args.includes('--all')) {
    return runAll();
  }

  const scraperName = args[2];

  if (!scraperName) {
    throw new Error('Scraper name not provided. available scrapers: ' + Object.keys(SCRAPERS).join(', '));
  }

  const scraper = SCRAPERS[scraperName as keyof typeof SCRAPERS];

  if (!scraper) {
    throw new Error(`Scraper "${scraperName}" not found. available scrapers: ${Object.keys(SCRAPERS).join(', ')}`);
  }

  schedule('* * * * *', () => {
    scraper.scrape();
  }).start();
}

runScraper(process.argv);
