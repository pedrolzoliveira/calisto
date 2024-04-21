import { type Request, type Response, type NextFunction } from 'express';

export const userAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    const redirectUrl = '/users/sign-in';
    return req.headers['hx-request']
      ? res.setHeader('HX-Redirect', redirectUrl).end()
      : res.redirect(redirectUrl);
  }

  return next();
};
