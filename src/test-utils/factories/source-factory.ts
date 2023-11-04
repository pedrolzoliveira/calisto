import { Source } from "@prisma/client";
import { Factory } from "./factory";
import { z } from "zod";
import { faker } from "@faker-js/faker";
import { prismaClient } from "@/src/infra/database/prisma/client";

class SourceFactory implements Factory<Source> {
	async create(attributes?: Partial<Source>): Promise<Source> {
		const sourceSchema = z.object({
			code: z.string().default(faker.word.words()),
			name: z.string().default(faker.company.name()),
			avatarUrl: z.string().url().nullable().default(faker.internet.avatar()),
		})

		return await prismaClient.source.create({ data: sourceSchema.parse(attributes) })
	}
}

export const sourceFactory = new SourceFactory()