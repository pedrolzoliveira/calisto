import { env } from './env';

export const pgConn = {
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
} as const;
