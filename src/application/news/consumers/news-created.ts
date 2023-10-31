import { populateNewsCategory } from '../queries/populate-news-category'
import { newsCreatedQueue } from '../queues/news-created'

newsCreatedQueue.consume(async ({ link }) => {
  await populateNewsCategory(link)
})
