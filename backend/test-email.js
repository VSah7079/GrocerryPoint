const { sendEmailVerification, sendPasswordResetEmail } = require('./services/emailService');

// Test email functionality
const testEmail = async () => {
  try {
    console.log('🧪 Testing Email Service...\n');
    
    // Test user object
    const testUser = {
      name: 'Test User',
      email: 'test@example.com' // Replace with your actual email for testing
    };
    
    // Test verification token
    const testToken = 'test-verification-token-12345';
    
    console.log('📧 Sending test verification email...');
    
    // Test email verification
    const result = await sendEmailVerification(testUser, testToken);
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('\n📧 Check your email inbox for the verification email.');
      console.log('🔗 If using Ethereal Email, check console for preview link.');
    } else {
      console.log('❌ Failed to send email');
    }
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n💡 Solutions:');
    console.log('1. Check EMAIL_FROM and EMAIL_PASSWORD in .env file');
    console.log('2. Make sure Gmail App Password is correct');
    console.log('3. Verify 2FA is enabled on Gmail account');
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  testEmail();
}

module.exports = { testEmail };