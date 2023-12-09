import { truncateDatabase } from './truncate-database';

export async function tearDown() {
  if (!process.env.DATABASE_URL?.includes('calisto_test')) {
    throw new Error('Teardown must only be run on test database');
  }

  await truncateDatabase();
  return process.exit(0);
}
