import { type Queue } from '../infra/messaging/rabbitmq/queue';

const sleep = async (ms: number) => await new Promise(resolve => setTimeout(resolve, ms));

export const waitForQueue = async (queue: Queue): Promise<any> => {
  await sleep(100);
  if (await queue.getMessageCount()) {
    return await waitForQueue(queue);
  }
};
