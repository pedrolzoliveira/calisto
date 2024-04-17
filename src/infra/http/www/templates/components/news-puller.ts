import { newsLoader } from './news-loader';

interface NewsPullerProps {
  profileId: string
  cursorLower: Date
}

export function newsPuller({ profileId, cursorLower }: NewsPullerProps) {
  return newsLoader({
    profileId,
    cursorLower,
    limit: Infinity,
    cursorUpper: new Date(),
    addPulling: true,
    hxTrigger: 'every 15s',
    hideLoader: true
  });
}
