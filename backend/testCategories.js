// Simple test to check if categories API is working
const testCategoriesAPI = async () => {
  console.log('🔍 Testing Categories API...');
  
  try {
    const response = await fetch('http://localhost:5000/api/categories');
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (data.success && Array.isArray(data.data)) {
      console.log('✅ Categories API working! Found', data.data.length, 'categories');
      return data.data;
    } else {
      console.log('⚠️ Categories API returned unexpected format');
      return [];
    }
  } catch (error) {
    console.error('❌ Categories API Error:', error.message);
    return [];
  }
};

// Also create some default categories if none exist
const createDefaultCategories = async () => {
  console.log('🏗️ Creating default categories...');
  
  const defaultCategories = [
    { name: 'Fruits', description: 'Fresh fruits and seasonal produce' },
    { name: 'Vegetables', description: 'Fresh vegetables and herbs' },
    { name: 'Dairy', description: 'Milk, cheese, yogurt and dairy products' },
    { name: 'Grains', description: 'Rice, wheat, cereals and grains' },
    { name: 'Beverages', description: 'Juices, soft drinks and beverages' },
    { name: 'Snacks', description: 'Chips, cookies and snack items' },
    { name: 'Bakery', description: 'Bread, cakes and bakery items' },
    { name: 'Meat & Seafood', description: 'Fresh meat, chicken and seafood' },
    { name: 'Frozen Foods', description: 'Frozen vegetables, ice cream and frozen meals' },
    { name: 'Household Items', description: 'Cleaning supplies and household essentials' }
  ];
  
  try {
    // First get admin token
    const adminLogin = await fetch('http://localhost:5000/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@grocerrypoint.com',
        password: 'admin123'
      })
    });
    
    const loginData = await adminLogin.json();
    const token = loginData.token;
    
    if (!token) {
      console.log('❌ Could not get admin token');
      return;
    }
    
    // Create categories
    for (const category of defaultCategories) {
      try {
        const response = await fetch('http://localhost:5000/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(category)
        });
        
        const result = await response.json();
        if (result.success) {
          console.log('✅ Created category:', category.name);
        } else {
          console.log('⚠️ Category might already exist:', category.name);
        }
      } catch (err) {
        console.log('⚠️ Error creating category:', category.name, err.message);
      }
    }
    
    console.log('🎉 Default categories setup complete!');
  } catch (error) {
    console.error('❌ Error creating categories:', error.message);
  }
};

// Run the tests
const runTests = async () => {
  console.log('🚀 Starting Categories System Test...\n');
  
  // Test if API is accessible
  const categories = await testCategoriesAPI();
  
  // If no categories found, create defaults
  if (categories.length === 0) {
    console.log('\n📝 No categories found, creating defaults...');
    await createDefaultCategories();
    
    // Test again
    console.log('\n🔄 Testing again after creating defaults...');
    await testCategoriesAPI();
  }
  
  console.log('\n✅ Categories system test complete!');
};

// Export for use in other files or run directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testCategoriesAPI, createDefaultCategories, runTests };
} else {
  // Run if executed directly
  runTests();
}