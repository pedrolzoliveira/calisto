import { prismaClient } from '@/src/infra/database/prisma/client';

export async function createExampleProfile(userId: string) {
  const exampleProfile = await prismaClient.profile.findFirst({
    select: {
      name: true,
      categories: true
    },
    where: {
      name: { startsWith: 'Exemplo:' },
      user: { role: 'admin' }
    },
    orderBy: { name: 'asc' }
  });

  if (!exampleProfile) {
    return;
  }

  await prismaClient.profile.create({
    data: {
      userId,
      name: exampleProfile.name,
      categories: exampleProfile.categories
    }
  });
}
