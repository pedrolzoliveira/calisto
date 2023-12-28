import { type Request, type Response, type NextFunction } from 'express';

export const adminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user?.role !== 'admin') {
    return res.redirect('/users/sign-in');
  }

  return next();
};
