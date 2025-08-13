const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

// Check if .env file already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  process.exit(0);
}

// Create .env file with default values
const envContent = `# Database
MONGODB_URL=mongodb://localhost:27017/grocerypoint

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# Session Secret (Change this in production!)
SESSION_SECRET=your-super-secret-session-key-here-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Edit the .env file and add your OAuth credentials');
  console.log('2. For Google OAuth: https://console.cloud.google.com/apis/credentials');
  console.log('3. For Facebook OAuth: https://developers.facebook.com/apps/');
  console.log('4. Run: npm start');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
} 