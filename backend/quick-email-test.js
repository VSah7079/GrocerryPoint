// Quick test script to verify email configuration
require('dotenv').config();
const { sendEmailVerification } = require('./services/emailService');

const testEmailVerification = async () => {
  console.log('🧪 Testing Email Verification...\n');
  
  // Test user data
  const testUser = {
    name: 'Test User',
    email: 'test@example.com' // You can change this to your email for testing
  };
  
  const testToken = 'test-verification-token-123';
  
  try {
    console.log('📧 Sending verification email...');
    console.log(`From: ${process.env.EMAIL_FROM}`);
    console.log(`To: ${testUser.email}`);
    console.log(`Token: ${testToken}\n`);
    
    const result = await sendEmailVerification(testUser, testToken);
    
    if (result.success) {
      console.log('✅ SUCCESS! Verification email sent successfully!');
      console.log(`📧 Message ID: ${result.messageId}`);
      console.log('\n🎉 Your email configuration is working properly!');
      console.log('\n📱 Now you can test registration:');
      console.log('1. Start backend: npm start');
      console.log('2. Start frontend: npm run dev (in Frontend folder)');
      console.log('3. Go to: http://localhost:5173/signup');
      console.log('4. Register new user and check email inbox');
    } else {
      console.log('❌ Failed to send verification email');
    }
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Gmail App Password Issue:');
      console.log('1. Make sure 2-Factor Authentication is enabled');
      console.log('2. Generate new App Password in Gmail settings');
      console.log('3. Update EMAIL_PASSWORD in .env file');
    } else if (error.message.includes('ECONNECTION')) {
      console.log('\n💡 Connection Issue:');
      console.log('1. Check internet connection');
      console.log('2. Verify SMTP settings in .env file');
    } else {
      console.log('\n💡 Check your .env configuration:');
      console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || 'NOT SET'}`);
      console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET'}`);
    }
  }
};

// Run the test
testEmailVerification().then(() => {
  console.log('\n🏁 Test completed!');
  process.exit(0);
}).catch(console.error);