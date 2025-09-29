const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

// Create admin user
const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocerrypoint');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@grocerrypoint.com' });
    if (adminExists) {
      console.log('❌ Admin user already exists');
      console.log('📧 Email:', adminExists.email);
      console.log('👤 Role:', adminExists.role);
      process.exit(0);
    }

    // Create new admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@grocerrypoint.com',
      password: 'Admin@123',
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();
    
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@grocerrypoint.com');
    console.log('🔑 Password: Admin@123');
    console.log('👤 Role: admin');
    console.log('✅ Verified: true');
    console.log('');
    console.log('🚀 You can now login to admin panel with these credentials!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser();