import { createTransport } from 'nodemailer';
import { env } from '@/src/config/env';

export async function createTransporter() {
  const transporter = createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_AUTH_USER,
      pass: env.SMTP_AUTH_PASS
    }
  });

  if (!await transporter.verify()) {
    throw new Error('Email transporter is not verified');
  }

  return transporter;
}
