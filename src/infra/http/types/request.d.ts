import { type User } from '@prisma/client';
import { type Session } from 'express-session';

declare module 'express-serve-static-core' {
  export interface Request {
    session: Session & {
      user?: User
    }
  }
}
