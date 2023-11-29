import { createHash } from 'crypto'
import { prismaClient } from '@/src/infra/database/prisma/client'

interface SignUpData {
  email: string
  password: string
}

/**
 *
 * @throws {Error} email already taken
 */
export const signUp = async (data: SignUpData) => {
  return await prismaClient.$transaction(async transaction => {
    const emailTaken = await transaction.user.count({ where: { email: data.email } })
    console.log(emailTaken)
    if (emailTaken) {
      throw new Error('Email já cadastrados')
    }

    const hash = createHash('sha256').update(data.password).digest('hex')
    return await transaction.user.create({
      data: {
        email: data.email,
        password: {
          create: { hash }
        }
      }
    })
  })
}
