require('dotenv').config({ path: '.env.local' });
const { Pool } = require('@neondatabase/serverless');

// Create a new pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateAdminEmail() {
  try {
    // Update the admin email from admin@edutech.com to admin@ewaede.com
    const result = await pool.query(
      `UPDATE users 
       SET email = $1, updated_at = NOW()
       WHERE role = 'admin' AND email = $2
       RETURNING id, name, email`,
      ['admin@ewaede.com', 'admin@edutech.com']
    );

    if (result.rows.length > 0) {
      const admin = result.rows[0];
      console.log('Admin email updated successfully!');
      console.log('Admin ID:', admin.id);
      console.log('Name:', admin.name);
      console.log('New Email:', admin.email);
      console.log('Password remains: admin123');
    } else {
      console.log('No admin found with email admin@edutech.com');
      
      // Check if admin exists with different email
      const adminCheck = await pool.query(
        `SELECT id, name, email FROM users WHERE role = 'admin'`
      );
      
      if (adminCheck.rows.length > 0) {
        console.log('Existing admin accounts:');
        adminCheck.rows.forEach(admin => {
          console.log(`- ID: ${admin.id}, Name: ${admin.name}, Email: ${admin.email}`);
        });
      } else {
        console.log('No admin accounts found in the database.');
      }
    }

  } catch (error) {
    console.error('Error updating admin email:', error);
  } finally {
    await pool.end();
  }
}

updateAdminEmail();