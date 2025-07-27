import { Pool } from '@neondatabase/serverless';

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Add default export to support existing imports like "import pool from '@/lib/db'"
export default db;