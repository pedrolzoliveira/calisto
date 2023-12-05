import { sanitizeWhiteSpace } from '@/src/utils/sanitize-white-space'
import { type ChatCompletionRequestMessage } from 'openai'

const chat = [
  {
    role: 'system',
    content: "Relate the categories with the user's given text. Use the index of the last user's message's categories to relate and return a valid JSON. If no category relates to the text, return an empty list."
  },
  {
    role: 'user',
    content: 'text:\nastronautas vão em missão interestelar para encontrar novo planeta habitável e salvar a humanidade da crise climática e da extinção.\ncategories:\n["Crise climática", "Bitcoin", "Viagem espacial"]'
  },
  {
    role: 'assistant',
    content: '[0,2]'
  }
] satisfies ChatCompletionRequestMessage[]

const text = `text:
{text}
categories:
{categories}`

export const createMessages = (content: string, categories: string[]) => {
  return [
    ...chat,
    {
      role: 'user',
      content: text
        .replace('{text}', sanitizeWhiteSpace(content))
        .replace('{categories}', JSON.stringify(categories))
    }
  ] satisfies ChatCompletionRequestMessage[]
}
