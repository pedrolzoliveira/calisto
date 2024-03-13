import { env } from '@/src/config/env';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  // organization: env.CHAT_GPT_ORGANIZATION_ID,
  apiKey: env.CHAT_GPT_KEY
});

export const openai = new OpenAIApi(configuration);
