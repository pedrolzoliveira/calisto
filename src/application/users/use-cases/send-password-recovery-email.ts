import { prismaClient } from '@/src/infra/database/prisma/client';
import { passwordRecovery } from '../../emails/templates/password-recovery';
import { emailsQueue } from '../../emails/queues/emails';

export async function sendPasswordRecoveryEmail(email: string) {
  const token = await prismaClient.resetPasswordToken.create({
    select: { token: true },
    data: { email }
  });

  const content = passwordRecovery({ email, token: token.token });

  emailsQueue.publish({ email, content, subject: 'Solicitação de redefinição de senha' });
}
