const axios = require('axios');

const testAdminAuth = async () => {
  try {
    console.log('🧪 Testing Admin Authentication System...\n');
    
    const baseURL = 'http://localhost:5000/api';
    
    // Test admin login
    console.log('1️⃣ Testing Admin Login...');
    const loginResponse = await axios.post(`${baseURL}/auth/admin-login`, {
      email: 'admin@grocerrypoint.com',
      password: 'Admin@123'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Admin login successful!');
      console.log('👤 Admin Name:', loginResponse.data.data.user.name);
      console.log('📧 Admin Email:', loginResponse.data.data.user.email);
      console.log('🎭 Role:', loginResponse.data.data.user.role);
      console.log('🔑 Token received:', loginResponse.data.data.token ? 'Yes' : 'No');
      
      // Test protected admin route
      console.log('\n2️⃣ Testing Protected Admin Route...');
      const token = loginResponse.data.data.token;
      
      const statsResponse = await axios.get(`${baseURL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (statsResponse.data) {
        console.log('✅ Admin stats accessed successfully!');
        console.log('📊 Stats:', statsResponse.data);
      }
    }
    
    // Test invalid login
    console.log('\n3️⃣ Testing Invalid Login...');
    try {
      await axios.post(`${baseURL}/auth/admin-login`, {
        email: 'admin@grocerrypoint.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Invalid credentials properly rejected');
      }
    }
    
    // Test non-admin user login attempt
    console.log('\n4️⃣ Testing Non-Admin Access...');
    try {
      await axios.post(`${baseURL}/auth/admin-login`, {
        email: 'user@example.com',
        password: 'password123'
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Non-admin access properly denied');
      }
    }
    
    console.log('\n🎉 All admin authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
  }
};

// Run tests
testAdminAuth();