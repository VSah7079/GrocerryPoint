const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email configuration (use your actual email service)
    return nodemailer.createTransporter({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Development configuration - use Ethereal for testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@grocerrypoint.com',
      to: user.email,
      subject: 'Password Reset Request - GrocerryPoint',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4ade80, #22c55e); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🛒 GrocerryPoint</h1>
            <p style="color: white; margin: 10px 0 0 0;">Password Reset Request</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151; margin-top: 0;">Hello ${user.name}!</h2>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your GrocerryPoint account. 
              Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #4ade80, #22c55e); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;
                        font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              If you can't click the button, copy and paste this link into your browser:<br>
              <span style="color: #4ade80; word-break: break-all;">${resetUrl}</span>
            </p>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                ⚠️ <strong>Security Notice:</strong> This link will expire in 10 minutes. 
                If you didn't request this password reset, please ignore this email.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              This email was sent by GrocerryPoint. If you have questions, contact our support team.
            </p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send email verification email
const sendEmailVerification = async (user, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@grocerrypoint.com',
      to: user.email,
      subject: 'Welcome to GrocerryPoint - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4ade80, #22c55e); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🛒 GrocerryPoint</h1>
            <p style="color: white; margin: 10px 0 0 0;">Welcome to Fresh Grocery Shopping!</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151; margin-top: 0;">Welcome ${user.name}! 🎉</h2>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              Thank you for joining GrocerryPoint! We're excited to help you get fresh groceries 
              delivered right to your door. To complete your registration, please verify your email address:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" 
                 style="background: linear-gradient(135deg, #4ade80, #22c55e); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;
                        font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              If you can't click the button, copy and paste this link into your browser:<br>
              <span style="color: #4ade80; word-break: break-all;">${verifyUrl}</span>
            </p>
            
            <div style="background: #dbeafe; border: 1px solid #3b82f6; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">🎁 Welcome Bonus!</h3>
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                Once verified, you'll receive ₹100 off your first order of ₹500 or more!
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              This verification link will expire in 24 hours. Welcome to the GrocerryPoint family!
            </p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email verification sent:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send order confirmation email
const sendOrderConfirmation = async (user, order) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@grocerrypoint.com',
      to: user.email,
      subject: `Order Confirmation #${order.orderNumber} - GrocerryPoint`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4ade80, #22c55e); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🛒 GrocerryPoint</h1>
            <p style="color: white; margin: 10px 0 0 0;">Order Confirmed!</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151; margin-top: 0;">Thank you ${user.name}!</h2>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="color: #374151; margin: 0 0 15px 0;">Order Details</h3>
              <p style="margin: 5px 0;"><strong>Order Number:</strong> #${order.orderNumber}</p>
              <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
              <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              <p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              We're preparing your order and will send you updates as it progresses. 
              You can track your order status in your account dashboard.
            </p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw new Error('Failed to send order confirmation email');
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendEmailVerification,
  sendOrderConfirmation
};