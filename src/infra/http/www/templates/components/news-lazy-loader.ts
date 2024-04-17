import { newsLoader } from './news-loader';

interface NewsLazyLoaderProps {
  profileId: string
  limit: number
  cursorUpper: Date
}

export function newsLazyLoader({ profileId, limit, cursorUpper }: NewsLazyLoaderProps) {
  return newsLoader({
    profileId,
    limit,
    cursorUpper,
    cursorLower: new Date(0),
    hxTrigger: 'revealed',
    addLazyLoading: true
  });
}
