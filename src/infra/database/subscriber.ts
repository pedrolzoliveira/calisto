import createSubscriber from 'pg-listen';
import { env } from '@/src/config/env';

export const subscriber = createSubscriber({ connectionString: env.DATABASE_URL });
