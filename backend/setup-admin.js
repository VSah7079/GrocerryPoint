require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const setupAdmin = async () => {
  try {
    // Connect to database
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocerrypoint');
    console.log('✅ Connected to MongoDB successfully!');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@grocerrypoint.com' });
    
    if (existingAdmin) {
      console.log('\n📋 Admin User Status:');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Name: ${existingAdmin.name}`);
      console.log(`🎭 Role: ${existingAdmin.role}`);
      console.log(`✅ Verified: ${existingAdmin.isVerified}`);
      console.log(`📅 Created: ${existingAdmin.createdAt}`);
      console.log('\n✅ Admin user already exists - ready to use!');
    } else {
      // Create admin user
      console.log('🔄 Creating new admin user...');
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@grocerrypoint.com',
        password: 'Admin@123',
        role: 'admin',
        isVerified: true
      });

      await adminUser.save();
      
      console.log('\n🎉 Admin user created successfully!');
      console.log('📧 Email: admin@grocerrypoint.com');
      console.log('🔑 Password: Admin@123');
      console.log('👤 Role: admin');
      console.log('✅ Status: Verified & Ready');
    }
    
    // Test admin stats
    console.log('\n🧪 Testing database collections...');
    const userCount = await User.countDocuments();
    console.log(`👥 Total Users: ${userCount}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n🎯 Admin setup complete! You can now:');
    console.log('1. Start backend server: npm start');
    console.log('2. Start frontend server: npm run dev');
    console.log('3. Login to admin panel with above credentials');
    
  } catch (error) {
    console.error('❌ Error in admin setup:', error.message);
    process.exit(1);
  }
};

// Run setup
setupAdmin();