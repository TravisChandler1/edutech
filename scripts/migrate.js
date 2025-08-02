require('dotenv').config({ path: '.env.local' });
const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlFile = fs.readFileSync(path.join(__dirname, '..', 'database', 'complete_schema.sql'), 'utf8');

// Create a new pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    await pool.query(sqlFile);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();
