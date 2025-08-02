require('dotenv').config({ path: '.env.local' });

async function testAdminLogin() {
  try {
    console.log('Testing admin login flow...');
    
    // Test 1: Check if admin exists
    console.log('\n1. Testing admin check API...');
    const checkResponse = await fetch('http://localhost:3000/api/admin/check');
    const checkData = await checkResponse.json();
    console.log('Admin exists:', checkData.exists);
    
    if (!checkData.exists) {
      console.log('❌ Admin check failed - no admin found');
      return;
    }
    
    // Test 2: Try admin login
    console.log('\n2. Testing admin login API...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login?admin=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@ewaede.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response status:', loginResponse.status);
    console.log('Login response:', loginData);
    
    if (loginResponse.ok) {
      console.log('✅ Admin login successful!');
      console.log('User role:', loginData.user?.role);
    } else {
      console.log('❌ Admin login failed');
    }
    
  } catch (error) {
    console.error('Error testing admin login:', error);
    console.log('Make sure your Next.js server is running on http://localhost:3000');
  }
}

testAdminLogin();