import { News } from "@prisma/client";
import { Factory } from "./factory";
import { faker } from '@faker-js/faker'
import { z } from "zod";
import { prismaClient } from "@/src/infra/database/prisma/client";


class NewsFactory implements Factory<News> {
	async create(attributes?: Partial<News> | undefined): Promise<News> {
		const newsSchema = z.object({
			sourceCode: z.string(),
			link: z.string().url().default(faker.internet.url()),
			title: z.string().default(faker.lorem.sentence()),
			description: z.string().default(faker.lorem.paragraph()),
			content: z.string().default(faker.lorem.paragraphs()),
			imageUrl: z.string().url().default(faker.internet.avatar()),
			createdAt: z.date().default(new Date()),
		})
		
		return await prismaClient.news.create({ data: newsSchema.parse(attributes) })
	}
}

export const newsFactory = new NewsFactory()