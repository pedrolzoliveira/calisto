import { prismaClient } from '@/src/infra/database/prisma/client';
import { createHash } from 'crypto';

interface SignInData {
  email: string
  password: string
}

/**
 *
 * @throws {Error} Email ou senha incorretos
 */
export const signIn = async ({ email, password }: SignInData) => {
  const hash = createHash('sha256').update(password).digest('hex');
  const user = await prismaClient.user.findFirst({
    where: {
      email,
      password: { hash }
    }
  });

  if (!user) {
    throw new Error('Email ou senha incorretos');
  }

  return user;
};
