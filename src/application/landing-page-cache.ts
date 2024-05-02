import { type getNews } from './news/queries/get-news';

interface LPCache {
  cachedAt: Date | null
  data: Awaited<ReturnType<typeof getNews>>
}

export const lpCache: LPCache = {
  cachedAt: null,
  data: []
};
