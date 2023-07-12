import { z } from 'zod'
import { openai } from '../client'
import categorizePrompt from '../prompts/categorize'

export const relateCategories = async (content: string, categories: string[]) => {
  if (!categories.length) {
    return []
  }

  console.log('use-cases/relate-categories', categories)

  const prompt = categorizePrompt.replace('{texto}', content).replace('{categorias}', JSON.stringify(categories))

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt
  })

  return z.string().array().parse(
    JSON.parse(response.data.choices[0].text ?? '')
  )
}
