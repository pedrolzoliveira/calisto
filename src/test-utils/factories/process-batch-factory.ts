import { type ProcessBatch } from '@prisma/client'
import { type Factory } from './factory'
import { prismaClient } from '@/src/infra/database/prisma/client'
import { z } from 'zod'
import { newsFactory } from './news-factory'

class ProcessBatchFactory implements Factory<ProcessBatch> {
  async create(attributes?: Partial<ProcessBatch>): Promise<ProcessBatch> {
    const foreignKeys = {
      newsLink: attributes?.newsLink ?? (await newsFactory.create()).link
    }

    const processBatchSchema = z.object({
      request: z.record(z.any()).optional(),
      response: z.record(z.any()).optional(),
      error: z.record(z.any()).optional()
    }).default({})

    return await prismaClient.processBatch.create({
      data: {
        ...foreignKeys,
        ...processBatchSchema.parse(attributes)
      }
    })
  }
}

export const processBatchFactory = new ProcessBatchFactory()
