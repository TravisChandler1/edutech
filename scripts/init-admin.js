const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeAdmin() {
  try {
    console.log('🚀 Initializing admin user...');
    
    const adminEmail = 'admin@ewaede.com';
    const adminPassword = 'ewaede@123';
    const adminName = 'Admin User';
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Check if admin user already exists
    const existingAdmin = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );
    
    if (existingAdmin.rows.length > 0) {
      console.log('✅ Admin user already exists. Updating password...');
      
      // Update existing admin user
      await db.query(
        'UPDATE users SET password_hash = $1, role = $2 WHERE email = $3',
        [hashedPassword, 'admin', adminEmail]
      );
      
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('➕ Creating new admin user...');
      
      // Create new admin user
      await db.query(
        `INSERT INTO users (name, email, password_hash, role, created_at) 
         VALUES ($1, $2, $3, $4, NOW())`,
        [adminName, adminEmail, hashedPassword, 'admin']
      );
      
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('\n🎯 Admin Login Credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\n🌐 Admin Login URL: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error initializing admin user:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

// Run the initialization
initializeAdmin();
