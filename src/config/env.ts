/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { z } from 'zod';

class Env {
  constructor(
    private readonly env: NodeJS.ProcessEnv
  ) {}

  public get CHAT_GPT_ORGANIZATION_ID() {
    const parsed = z.string().safeParse(this.env.CHAT_GPT_ORGANIZATION_ID);
    if (!parsed.success) {
      throw new Error(`Error accessing env.CHAT_GPT_ORGANIZATION_ID: ${parsed.error.message}`);
    }

    return parsed.data;
  }

  public get CHAT_GPT_KEY() {
    const parsed = z.string().safeParse(this.env.CHAT_GPT_KEY);
    if (!parsed.success) {
      throw new Error(`Error accessing env.CHAT_GPT_KEY: ${parsed.error.message}`);
    }

    return parsed.data;
  }

  public get RABBIT_MQ_URL() {
    const parsed = z.string().safeParse(this.env.RABBIT_MQ_URL);
    if (!parsed.success) {
      throw new Error(`Error accessing env.RABBIT_MQ_URL: ${parsed.error.message}`);
    }

    return parsed.data;
  }

  public get PORT() {
    const parsed = z.number({ coerce: true }).default(8080).safeParse(this.env.PORT);

    if (!parsed.success) {
      throw new Error(`Error accessing env.PORT: ${parsed.error.message}`);
    }

    return parsed.data;
  }

  public get SESSION_SECRET() {
    const parsed = z.string().safeParse(this.env.SESSION_SECRET);

    if (!parsed.success) {
      throw new Error(`Error accessing env.SESSION_SECRET: ${parsed.error.message}`);
    }

    return parsed.data;
  }

  public get REDIS_URL() {
    const parsed = z.string().safeParse(this.env.REDIS_URL);

    if (!parsed.success) {
      throw new Error(`Error accessing env.REDIS_URL: ${parsed.error.message}`);
    }

    return parsed.data;
  }

  public get SMTP_HOST() {
    const parsed = z.string().safeParse(this.env.SMTP_HOST);

    if (!parsed.success) {
      throw new Error(`Error accessing env.SMTP_HOST: ${parsed.error.message}`);
    }

    return parsed.data;
  }

  public get SMTP_PORT() {
    const parsed = z.number({ coerce: true }).safeParse(this.env.SMTP_PORT);

    if (!parsed.success) {
      throw new Error(`Error accessing env.SMTP_PORT: ${parsed.error.message}`);
    }

    return parsed.data;
  }

  public get SMTP_AUTH_USER() {
    const parsed = z.string().safeParse(this.env.SMTP_AUTH_USER);

    if (!parsed.success) {
      throw new Error(`Error accessing env.SMTP_AUTH_USER: ${parsed.error.message}`);
    }

    return parsed.data;
  }

  public get SMTP_AUTH_PASS() {
    const parsed = z.string().safeParse(this.env.SMTP_AUTH_PASS);

    if (!parsed.success) {
      throw new Error(`Error accessing env.SMTP_AUTH_PASS: ${parsed.error.message}`);
    }

    return parsed.data;
  }

  public get SERVER_URL() {
    const parsed = z.string().safeParse(this.env.SERVER_URL);

    if (!parsed.success) {
      throw new Error(`Error accessing env.SERVER_URL: ${parsed.error.message}`);
    }

    return parsed.data;
  }

  public get DATABASE_URL() {
    const parsed = z.string().safeParse(this.env.DATABASE_URL);

    if (!parsed.success) {
      throw new Error(`Error accessing env.DATABASE_URL: ${parsed.error.message}`);
    }

    return parsed.data;
  }
}

export const env = new Env(process.env);
