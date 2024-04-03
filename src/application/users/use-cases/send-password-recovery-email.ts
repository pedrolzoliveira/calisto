import { prismaClient } from '@/src/infra/database/prisma/client';
import { publisher } from '../../publisher';
import { passwordRecovery } from '../../emails/templates/password-recovery';

export async function sendPasswordRecoveryEmail(email: string) {
  const token = await prismaClient.resetPasswordToken.create({
    select: { token: true },
    data: { email }
  });

  const content = passwordRecovery({ email, token: token.token });

  publisher.publish('emails', {
    content,
    email,
    subject: 'Solicitação de redefinição de senha'
  });
}
