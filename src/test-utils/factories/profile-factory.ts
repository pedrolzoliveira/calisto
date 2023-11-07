import { Profile } from "@prisma/client";
import { Factory } from "./factory";
import { z } from "zod";
import { faker } from "@faker-js/faker";

import { CreateProfile } from "@/src/application/profiles/use-cases/create-profile";

class ProfileFactory implements Factory<Profile & { categories: string[] }> {
	async create(attributes?: Partial<Omit<Profile, 'id' | 'createdAt'>> & { categories?: string[] }): Promise<Profile  & { categories: string[] }> {
		const profileSchema = z.object({
			name: z.string().default(faker.word.words()),
			categories: z.string().array().default(new Array(5).fill(null).map(() => faker.lorem.word())),
		})

		const { name, categories } = profileSchema.parse(attributes ?? {});

		return {
			...CreateProfile({ name, categories }),
			categories,
		} as any;
	}
}

export const profileFactory = new ProfileFactory()