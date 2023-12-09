import { type Connection } from 'amqplib';

export const createChannel = async (connection: Connection) => {
  return await connection.createChannel();
};
