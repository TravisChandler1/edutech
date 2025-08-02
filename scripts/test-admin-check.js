require('dotenv').config({ path: '.env.local' });
const { Pool } = require('@neondatabase/serverless');

// Create a new pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testAdminCheck() {
  try {
    console.log('Testing admin check...');
    
    // Test the same query as the API
    const result = await pool.query(
      `SELECT 1 FROM users WHERE role = 'admin'
       UNION
       SELECT 1 FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE r.name = 'admin'
       LIMIT 1`
    );

    console.log('Admin exists:', result.rows.length > 0);
    console.log('Number of admin records found:', result.rows.length);
    
    // Also check what admins exist
    const adminUsers = await pool.query(
      `SELECT id, name, email, role FROM users WHERE role = 'admin'`
    );
    
    console.log('Admin users in database:');
    adminUsers.rows.forEach(admin => {
      console.log(`- ID: ${admin.id}, Name: ${admin.name}, Email: ${admin.email}, Role: ${admin.role}`);
    });

  } catch (error) {
    console.error('Error testing admin check:', error);
  } finally {
    await pool.end();
  }
}

testAdminCheck();