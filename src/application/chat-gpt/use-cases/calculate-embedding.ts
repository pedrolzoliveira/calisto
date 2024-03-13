import { openai } from '../client';

export const calculateEmbeddings = async (texts: string[]) => {
  const response = await openai.createEmbedding({
    model: 'text-embedding-3-small',
    input: texts
  });

  return response.data.data.map(({ embedding, index }) => ({
    text: texts[index],
    embedding
  }));
};
