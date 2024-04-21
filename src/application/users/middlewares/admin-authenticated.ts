import { type Request, type Response, type NextFunction } from 'express';

export const adminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user?.role !== 'admin') {
    const redirectUrl = '/users/sign-in';
    return req.headers['hx-request']
      ? res.setHeader('HX-Redirect', redirectUrl).end()
      : res.redirect(redirectUrl);
  }

  return next();
};
