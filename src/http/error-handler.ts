import { type Request, type Response, type NextFunction } from 'express'
import { ZodError } from 'zod'

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).send({
      errors: error.errors,
      stack: error.stack
    })
  }

  return res.status(500).send({ message: 'Internal server error' })
}
