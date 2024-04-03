import { prismaClient } from '@/src/infra/database/prisma/client';
import { createHash } from 'crypto';

interface RecoverPasswordData {
  token: string
  password: string
}

export async function recoverPassword(data: RecoverPasswordData) {
  const { email } = await prismaClient.resetPasswordToken.findFirstOrThrow({
    select: { email: true },
    where: { token: data.token }
  });

  const hash = createHash('sha256').update(data.password).digest('hex');

  await prismaClient.$transaction([
    prismaClient.user.update({
      where: { email },
      data: {
        password: {
          update: { hash }
        }
      }
    }),
    prismaClient.resetPasswordToken.deleteMany({
      where: { email }
    })
  ]);
}
