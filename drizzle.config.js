import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: "./utils/db/schema.ts",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: "database url"
  },
  verbose: true,
  strict: true
});