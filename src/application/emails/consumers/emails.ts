import { emailQueue } from '../queues/emails';
import { createTransporter } from '../utils/create-transporter';

export const emailsConsumer = emailQueue.createConsumer(
  async (data) => {
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: 'no-reply@lightbeam.news',
      to: data.email,
      subject: data.subject,
      html: data.content
    });
  }
);
