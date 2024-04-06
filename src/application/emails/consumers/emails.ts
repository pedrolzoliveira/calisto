import { logger } from '@/src/infra/logger';
import { emailsQueue } from '../queues/emails';
import { createTransporter } from '../utils/create-transporter';

export const emailsConsumer = emailsQueue.createConsumer(
  async (data) => {
    const transporter = await createTransporter();

    logger.info(`Sending email - ${data.subject} - to ${data.email}`);
    await transporter.sendMail({
      from: 'Light Beam News <contact@lightbeam.news>',
      to: data.email,
      subject: data.subject,
      html: data.content
    });
  }
);
