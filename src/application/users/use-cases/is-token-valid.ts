import { prismaClient } from '@/src/infra/database/prisma/client';

export async function isTokenValid(token: string): Promise<boolean> {
  const tokenDb = await prismaClient.resetPasswordToken.findFirst({
    select: { token: true },
    where: {
      token,
      expiresAt: {
        gte: new Date()
      }
    }
  });

  return Boolean(tokenDb);
}
