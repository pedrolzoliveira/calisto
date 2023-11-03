import { prismaClient } from "../infra/database/prisma/client"

async function truncateDatabase() {
	return await prismaClient.$executeRaw`
		DO
		$do$
		DECLARE
				r RECORD;
		BEGIN
				-- Disable all triggers to avoid foreign key checks and other constraints
				EXECUTE 'SET session_replication_role = replica;';

				-- Generate and execute a 'TRUNCATE' statement for each table
				FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
						EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE;';
				END LOOP;

				-- Enable triggers again
				EXECUTE 'SET session_replication_role = DEFAULT;';
		END
		$do$;`
}

export async function tearDown() {
	if (!process.env.DATABASE_URL?.includes('calisto_test')) {
		throw new Error('Teardown must only be run on test database')
	}

	await truncateDatabase()
	return process.exit(0)
}