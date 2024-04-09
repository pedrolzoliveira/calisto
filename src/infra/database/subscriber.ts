import createSubscriber from 'pg-listen';
import { pgConn } from '@/src/config/pg-conn';

export const subscriber = createSubscriber(pgConn);
