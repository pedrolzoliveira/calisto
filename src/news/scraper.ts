import { schedule } from 'node-cron'
import { scrapeEstadaoNews } from './estadao/jobs/scrape-news'
import { scrapeFolhaNews } from './folha/jobs/scrape-news'
import { scrapeValorNews } from './valor/jobs/scrape-news'
import { scrapeUolNews } from './uol/jobs/scrape-news'
import { scrapeG1News } from './g1/jobs/scrape-news'

schedule('* * * * *', async () => { await scrapeEstadaoNews() }).start()
schedule('* * * * *', async () => { await scrapeFolhaNews() }).start()
schedule('* * * * *', async () => { await scrapeValorNews() }).start()
schedule('* * * * *', async () => { await scrapeUolNews() }).start()
schedule('* * * * *', async () => { await scrapeG1News() }).start()
