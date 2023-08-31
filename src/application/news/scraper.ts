import { schedule } from 'node-cron'
import { scrapeEstadaoNews } from './sources/estadao/jobs/scrape-news'
import { scrapeFolhaNews } from './sources/folha/jobs/scrape-news'
import { scrapeValorNews } from './sources/valor/jobs/scrape-news'
import { scrapeUolNews } from './sources/uol/jobs/scrape-news'
import { scrapeG1News } from './sources/g1/jobs/scrape-news'

schedule('* * * * *', async () => { await scrapeEstadaoNews().catch(console.error) }).start()
schedule('* * * * *', async () => { await scrapeFolhaNews().catch(console.error) }).start()
schedule('* * * * *', async () => { await scrapeValorNews().catch(console.error) }).start()
schedule('* * * * *', async () => { await scrapeUolNews().catch(console.error) }).start()
schedule('* * * * *', async () => { await scrapeG1News().catch(console.error) }).start()
