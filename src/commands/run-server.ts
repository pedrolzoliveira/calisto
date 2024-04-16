import { server } from '@/src/infra/http/server';
import { logger } from '@/src/infra/logger';
import { env } from '@/src/config/env';
import { prismaClient } from '../infra/database/prisma/client';
import { subscriber } from '../infra/database/subscriber';
import { asyncLocalStorage } from '../infra/http/async-storage';

async function runServer() {
  try {
    await Promise.all([
      prismaClient.$connect(),
      subscriber.connect()
    ]);

    server.listen(env.PORT, () => {
      logger.info(`listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error(error);
    logger.error('error initializing server:', error);
    process.exit(1);
  }
}

asyncLocalStorage.run(
  new Map(),
  async () => await runServer()
);
