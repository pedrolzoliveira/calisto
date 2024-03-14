import { env } from '@/src/config/env';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: env.CHAT_GPT_KEY
});

export const openai = new OpenAIApi(configuration);
