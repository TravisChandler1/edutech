require('dotenv').config({ path: '.env.local' });
const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

// Create a new pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupAdmin() {
  try {
    // Check if admin already exists
    const adminCheck = await pool.query(
      `SELECT 1 FROM users WHERE role = 'admin'`
    );

    if (adminCheck.rows.length > 0) {
      console.log('Admin already exists');
      return;
    }

    const name = 'Admin User';
    const email = 'admin@ewaede.com';
    const password = 'admin123'; // Change this to a secure password

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const userResult = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, email_verified, created_at, updated_at)
       VALUES ($1, $2, $3, 'admin', true, NOW(), NOW())
       RETURNING id`,
      [name, email, hashedPassword]
    );

    const userId = userResult.rows[0].id;

    console.log('Admin account created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', userId);
    console.log('Please change the password after first login.');

  } catch (error) {
    console.error('Admin setup error:', error);
  } finally {
    await pool.end();
  }
}

setupAdmin();