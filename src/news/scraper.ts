import { schedule } from 'node-cron'
// import { createEstadaoNews } from './estadao/jobs/create-news'
import { createFolhaNews } from './folha/jobs/create-news'
// import { createValorNews } from './valor/jobs/create-news'
// import { createUolNews } from './uol/jobs/create-news'
// import { createG1News } from './g1/jobs/create-news'

// schedule('* * * * *', async () => { await createEstadaoNews() }).start()
schedule('* * * * *', async () => { await createFolhaNews() }).start()
// schedule('* * * * *', async () => { await createValorNews() }).start()
// schedule('* * * * *', async () => { await createUolNews() }).start()
// schedule('* * * * *', async () => { await createG1News() }).start()
