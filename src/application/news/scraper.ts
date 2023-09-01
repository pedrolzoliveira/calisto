import { schedule } from 'node-cron'
import { scrapeEstadaoNews } from './sources/estadao/jobs/scrape-news'
import { scrapeFolhaNews } from './sources/folha/jobs/scrape-news'
import { scrapeValorNews } from './sources/valor/jobs/scrape-news'
import { scrapeUolNews } from './sources/uol/jobs/scrape-news'
import { scrapeG1News } from './sources/g1/jobs/scrape-news'
import { logger } from '@/src/infra/logger'

schedule('* * * * *', async () => { await scrapeEstadaoNews().catch(logger.error) }).start()
schedule('* * * * *', async () => { await scrapeFolhaNews().catch(logger.error) }).start()
schedule('* * * * *', async () => { await scrapeValorNews().catch(logger.error) }).start()
schedule('* * * * *', async () => { await scrapeUolNews().catch(logger.error) }).start()
schedule('* * * * *', async () => { await scrapeG1News().catch(logger.error) }).start()
