import { server } from '@/src/infra/http/server';
import { logger } from '@/src/infra/logger';
import { env } from '@/src/config/env';
import { prismaClient } from '../infra/database/prisma/client';
import { createConnection } from '../infra/messaging/rabbitmq/create-connection';
import { createChannel } from '../infra/messaging/rabbitmq/create-channel';
import { publisher } from '../application/publisher';
import { redisClient } from '../infra/http/session';

async function runServer() {
  try {
    const [channel] = await Promise.all([
      createConnection().then(
        async connection => await createChannel(connection)
      ),
      prismaClient.$connect(),
      redisClient.connect()
    ]);

    publisher.bindChannel(channel);

    server.listen(env.PORT, () => {
      logger.info(`listening on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('error initializing server:', error);
    process.exit(1);
  }
}

runServer();
