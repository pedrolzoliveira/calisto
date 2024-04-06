import { env } from '@/src/config/env';
import expressSession from 'express-session';
import PgStoreImport from 'connect-pg-simple';

const PgStore = PgStoreImport(expressSession);

const pgStore = new PgStore({
  conString: env.DATABASE_URL,
  createTableIfMissing: true
});

export const session = expressSession({
  store: pgStore,
  secret: env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
});
