import { env } from '@/src/config/env';
import expressSession from 'express-session';
import PgStoreImport from 'connect-pg-simple';
import { pgConn } from '@/src/config/pg-conn';

const PgStore = PgStoreImport(expressSession);

const pgStore = new PgStore({ conObject: pgConn });

export const session = expressSession({
  store: pgStore,
  secret: env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
});
