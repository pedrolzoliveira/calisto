import { createQueue } from '@/src/infra/database/queue';
import { z } from 'zod';
import { createTransporter } from '../utils/create-transporter';
import { logger } from '@/src/infra/logger';

const emailsSchema = z.object({
  email: z.string().email(),
  content: z.string(),
  subject: z.string()
});

export const emailsQueue = createQueue({
  key: 'emails',
  schema: emailsSchema,
  consumeFn: async (data) => {
    const transporter = await createTransporter();

    logger.info(`Sending email - ${data.subject} - to ${data.email}`);
    const sentMessageInfo = await transporter.sendMail({
      from: 'Light Beam News <contact@lightbeam.news>',
      to: data.email,
      subject: data.subject,
      html: data.content
    });
    logger.info({ sentMessageInfo });
  }
});
