import { newsCreatedQueue } from '../queues/news-created'
import { relateCategories } from '../use-cases/relate-categories'

newsCreatedQueue.consume(async data => await relateCategories(data))
