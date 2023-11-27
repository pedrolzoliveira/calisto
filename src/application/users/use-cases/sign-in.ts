import { prismaClient } from '@/src/infra/database/prisma/client'
import { createHash } from 'crypto'

interface SignInData {
  email: string
  password: string
}

/**
 *
 * @throws {NotFoundError} user not found
 */
export const signIn = async ({ email, password }: SignInData) => {
  const hash = createHash('sha256').update(password).digest('hex')
  return await prismaClient.user.findFirstOrThrow({
    where: {
      email,
      password: { hash }
    }
  })
}
