import { env } from '@/src/config/env';
import expressSession from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

export const redisClient = createClient({
  url: env.REDIS_URL
});

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'light-beam-news:'
});

export const session = expressSession({
  store: redisStore,
  secret: env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
});
