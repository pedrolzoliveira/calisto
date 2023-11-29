import { type Request, type Response, type NextFunction } from 'express'

export const userAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.redirect('/users/sign-in')
  }

  return next()
}
