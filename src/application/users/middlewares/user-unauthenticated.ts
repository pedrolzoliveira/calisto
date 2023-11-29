import { type Request, type Response, type NextFunction } from 'express'

export const userUnauthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    return res.redirect('/news')
  }

  return next()
}
