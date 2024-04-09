import createSubscriber from 'pg-listen';
import { env } from '@/src/config/env';

export const subscriber = createSubscriber({
  connectionString: env.DATABASE_URL.split('?').at(0),
  ...(
    env.NODE_ENV === 'production'
      ? ({
          ssl: {
            ca: Buffer.from(env.CA_CERT as string)
          }
        })
      : ({})
  )
});
