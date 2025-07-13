// migrate.ts
import { neon } from "@neondatabase/serverless";

const sql = neon(
  "database url"
);

async function migrate() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        address VARCHAR(42) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        balance INTEGER NOT NULL DEFAULT 0,
        staked_amount INTEGER NOT NULL DEFAULT 0,
        rewards_earned INTEGER NOT NULL DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS webpages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name TEXT,
        domain VARCHAR(255) NOT NULL,
        cid VARCHAR(255) NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS deployments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        webpage_id INTEGER REFERENCES webpages(id),
        transaction_hash VARCHAR(66) NOT NULL,
        deployed_at TIMESTAMP DEFAULT NOW(),
        deployment_url VARCHAR(255) NOT NULL,
        filecoin_info TEXT
      )
    `;

    console.log("Database migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

migrate();