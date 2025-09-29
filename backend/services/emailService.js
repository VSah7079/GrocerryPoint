const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Check if email credentials are configured
  if (process.env.EMAIL_FROM && process.env.EMAIL_PASSWORD) {
    // Use real Gmail SMTP (when credentials are provided)
    return nodemailer.createTransport({
      service: 'gmail',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Development/Testing configuration - use Ethereal Email
    console.log('⚠️  Email credentials not found. Using Ethereal Email for testing.');
    console.log('📧 To use real emails, configure EMAIL_FROM and EMAIL_PASSWORD in .env file');
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
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
      from: `"GrocerryPoint Security Team" <${process.env.EMAIL_FROM || 'security@grocerrypoint.com'}>`,
      to: user.email,
      subject: '🔐 Password Reset Request - GrocerryPoint Account Security',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - GrocerryPoint Security</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            
            <!-- Main Container -->
            <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                
                <!-- Security Header -->
                <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%); padding: 40px 30px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255,255,255,0.3);">
                        <span style="font-size: 35px;">�</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Account Security Alert</h1>
                    <p style="color: #fecaca; margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">Password Reset Request for GrocerryPoint</p>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 40px 30px; background-color: #ffffff;">
                    
                    <!-- User Greeting -->
                    <div style="margin-bottom: 30px;">
                        <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Hello ${user.name},</h2>
                        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">
                            We received a request to reset the password for your GrocerryPoint account.
                        </p>
                    </div>
                    
                    <!-- Security Alert -->
                    <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #dc2626; padding: 25px; border-radius: 8px; margin: 25px 0;">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
                            <h3 style="color: #dc2626; margin: 0; font-size: 18px; font-weight: 600;">Security Notice</h3>
                        </div>
                        <p style="color: #991b1b; font-size: 15px; line-height: 1.6; margin: 0;">
                            If you didn't request this password reset, please contact our security team immediately at 
                            <strong>security@grocerrypoint.com</strong> or call <strong>1800-SECURITY</strong>
                        </p>
                    </div>
                    
                    <!-- Reset Instructions -->
                    <div style="background: #f0f9ff; border-radius: 8px; padding: 25px; margin: 25px 0; border: 1px solid #0ea5e9;">
                        <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📋 Reset Instructions:</h3>
                        <ol style="color: #0f172a; margin: 0; padding-left: 20px; line-height: 1.8;">
                            <li>Click the "Reset Password" button below</li>
                            <li>You'll be redirected to our secure password reset page</li>
                            <li>Enter your new password (must be at least 8 characters)</li>
                            <li>Confirm your new password</li>
                            <li>Your account will be updated immediately</li>
                        </ol>
                    </div>
                    
                    <!-- Reset Button */
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${resetUrl}" 
                           style="display: inline-block; background: linear-gradient(135deg, #dc2626, #ef4444); color: #ffffff; padding: 18px 45px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3); transition: all 0.3s ease;">
                            🔐 Reset My Password Securely
                        </a>
                        <p style="color: #ef4444; font-size: 13px; margin: 15px 0 0 0; font-weight: 600;">
                            ⏰ This secure link expires in 10 minutes for your security
                        </p>
                    </div>
                    
                    <!-- Alternative Link -->
                    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #e5e7eb;">
                        <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
                            🔗 Can't click the button? Copy this secure link:
                        </p>
                        <p style="color: #dc2626; font-size: 12px; word-break: break-all; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #d1d5db; font-family: monospace; overflow-x: auto;">
                            ${resetUrl}
                        </p>
                    </div>
                    
                    <!-- Security Tips -->
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; border-radius: 12px; padding: 25px; margin: 30px 0;">
                        <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🛡️ Security Tips:</h3>
                        <ul style="color: #047857; margin: 0; padding-left: 20px; line-height: 1.7;">
                            <li>Use a strong, unique password for your GrocerryPoint account</li>
                            <li>Include uppercase, lowercase, numbers, and special characters</li>
                            <li>Never share your password with anyone</li>
                            <li>Enable two-factor authentication if available</li>
                        </ul>
                    </div>
                    
                    <!-- Request Details -->
                    <div style="border-top: 2px solid #e5e7eb; margin-top: 40px; padding-top: 25px;">
                        <h4 style="color: #1f2937; font-size: 16px; margin: 0 0 15px 0;">📊 Request Details:</h4>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                            <p style="color: #475569; font-size: 13px; margin: 0; font-family: monospace;">
                                <strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST<br>
                                <strong>Account:</strong> ${user.email}<br>
                                <strong>Request ID:</strong> PWD-${Date.now()}<br>
                                <strong>Security Level:</strong> High Priority
                            </p>
                        </div>
                    </div>
                    
                    <!-- Contact Support -->
                    <div style="background: #fef7ff; border-left: 4px solid #a855f7; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                        <h4 style="color: #7c2d12; margin: 0 0 10px 0; font-size: 16px;">📞 Need Help?</h4>
                        <p style="color: #8b5cf6; margin: 0; font-size: 14px; line-height: 1.6;">
                            <strong>Security Helpline:</strong> 1800-SECURITY (24/7)<br>
                            <strong>Email:</strong> security@grocerrypoint.com<br>
                            <strong>Live Chat:</strong> Available on our website
                        </p>
                    </div>
                </div>
                
                <!-- Footer */
                <div style="background-color: #1f2937; padding: 30px; text-align: center;">
                    <div style="margin-bottom: 20px;">
                        <span style="color: #ffffff; font-size: 24px; margin-right: 10px;">🛒</span>
                        <span style="color: #ffffff; font-size: 20px; font-weight: 600;">GrocerryPoint Security Team</span>
                    </div>
                    <p style="color: #d1d5db; font-size: 14px; margin: 0 0 10px 0;">
                        <strong>GrocerryPoint Private Limited</strong> • Security Operations Center
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 15px 0;">
                        Registered Office: New Delhi, India • CIN: U12345DL2025PTC123456
                    </p>
                    <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                        This is an automated security email sent to ${user.email}
                        <br>© 2025 GrocerryPoint. All rights reserved. Your security is our priority.
                    </p>
                </div>
                
            </div>
        </body>
        </html>
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
      from: `"GrocerryPoint Team" <${process.env.EMAIL_FROM || 'noreply@grocerrypoint.com'}>`,
      to: user.email,
      subject: '✅ Account Verification Required - GrocerryPoint India',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Verification - GrocerryPoint</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            
            <!-- Main Container -->
            <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                
                <!-- Header with Company Branding -->
                <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); padding: 40px 30px; text-align: center; position: relative;">
                    <div style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255,255,255,0.2);">
                        <span style="font-size: 35px;">🛒</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">GrocerryPoint</h1>
                    <p style="color: #dcfce7; margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">India's Trusted Online Grocery Store</p>
                    <p style="color: #bbf7d0; margin: 5px 0 0 0; font-size: 14px;">🇮🇳 Serving Fresh Groceries Across India Since 2025</p>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 40px 30px; background-color: #ffffff;">
                    
                    <!-- Welcome Message -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 26px; font-weight: 600;">Welcome to GrocerryPoint Family! 🎉</h2>
                        <p style="color: #059669; font-size: 18px; font-weight: 500; margin: 0;">Dear ${user.name},</p>
                    </div>
                    
                    <!-- Verification Message -->
                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-left: 4px solid #10b981; padding: 25px; border-radius: 8px; margin: 25px 0;">
                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 15px 0;">
                            Thank you for choosing <strong>GrocerryPoint</strong> for your daily grocery needs! We're excited to serve you fresh, quality groceries at your doorstep.
                        </p>
                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0;">
                            To complete your registration and start shopping, please verify your email address by clicking the button below:
                        </p>
                    </div>
                    
                    <!-- Verification Button -->
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${verifyUrl}" 
                           style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
                            ✅ Verify My Email Address
                        </a>
                        <p style="color: #6b7280; font-size: 12px; margin: 15px 0 0 0;">
                            This link is secure and will expire in 24 hours
                        </p>
                    </div>
                    
                    <!-- Alternative Link -->
                    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #e5e7eb;">
                        <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
                            🔗 Can't click the button? Copy and paste this link:
                        </p>
                        <p style="color: #059669; font-size: 13px; word-break: break-all; background: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db; font-family: monospace;">
                            ${verifyUrl}
                        </p>
                    </div>
                    
                    <!-- Welcome Offer -->
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center; position: relative;">
                        <div style="background: #f59e0b; color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: 600; margin-bottom: 15px;">
                            🎁 WELCOME OFFER
                        </div>
                        <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 20px; font-weight: 700;">Get ₹200 OFF on Your First Order!</h3>
                        <p style="color: #b45309; margin: 0; font-size: 15px; font-weight: 500;">
                            Minimum order value ₹999 • Valid for 30 days • Use code: <strong>WELCOME200</strong>
                        </p>
                    </div>
                    
                    <!-- Company Info -->
                    <div style="border-top: 2px solid #e5e7eb; margin-top: 40px; padding-top: 30px;">
                        <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 25px;">
                            <div style="flex: 1; min-width: 200px; margin-bottom: 15px;">
                                <h4 style="color: #1f2937; font-size: 16px; margin: 0 0 10px 0;">📞 Customer Support</h4>
                                <p style="color: #6b7280; font-size: 14px; margin: 0;">1800-GROCERY (24/7)</p>
                                <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">support@grocerrypoint.com</p>
                            </div>
                            <div style="flex: 1; min-width: 200px; margin-bottom: 15px;">
                                <h4 style="color: #1f2937; font-size: 16px; margin: 0 0 10px 0;">🚚 Delivery Areas</h4>
                                <p style="color: #6b7280; font-size: 14px; margin: 0;">Delhi NCR • Mumbai • Bangalore</p>
                                <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Hyderabad • Chennai • Pune</p>
                            </div>
                        </div>
                        
                        <!-- Security Notice -->
                        <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px; padding: 15px; margin: 20px 0;">
                            <p style="color: #dc2626; margin: 0; font-size: 13px; font-weight: 500;">
                                🔒 <strong>Security Notice:</strong> This email was sent from a secure server. If you didn't create an account with GrocerryPoint, please ignore this email or contact our support team.
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #1f2937; padding: 30px; text-align: center;">
                    <p style="color: #d1d5db; font-size: 14px; margin: 0 0 10px 0;">
                        <strong>GrocerryPoint Private Limited</strong> • Registered Office: New Delhi, India
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 15px 0;">
                        CIN: U12345DL2025PTC123456 • GSTIN: 07ABCDE1234F1Z5
                    </p>
                    <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                        This email was sent to ${user.email}. You're receiving this because you created an account with us.
                        <br>© 2025 GrocerryPoint. All rights reserved. Made with ❤️ in India.
                    </p>
                </div>
                
            </div>
        </body>
        </html>
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
      from: `"GrocerryPoint Orders" <${process.env.EMAIL_FROM || 'orders@grocerrypoint.com'}>`,
      to: user.email,
      subject: `✅ Order Confirmed #${order.orderNumber} - Fresh Groceries on the way!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation - GrocerryPoint</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            
            <!-- Main Container -->
            <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                
                <!-- Success Header -->
                <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); padding: 40px 30px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255,255,255,0.3);">
                        <span style="font-size: 35px;">✅</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Order Confirmed!</h1>
                    <p style="color: #dcfce7; margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">Your fresh groceries are being prepared</p>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 40px 30px; background-color: #ffffff;">
                    
                    <!-- Thank You Message -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 26px; font-weight: 600;">Thank You ${user.name}! 🙏</h2>
                        <p style="color: #059669; font-size: 18px; font-weight: 500; margin: 0;">Your order has been successfully placed and confirmed.</p>
                    </div>
                    
                    <!-- Order Summary Card -->
                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #10b981; border-radius: 15px; padding: 30px; margin: 25px 0; position: relative;">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <span style="background: #10b981; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600;">ORDER DETAILS</span>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div>
                                <h4 style="color: #065f46; margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</h4>
                                <p style="color: #1f2937; margin: 0; font-size: 18px; font-weight: 700;">#${order.orderNumber}</p>
                            </div>
                            <div>
                                <h4 style="color: #065f46; margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Total Amount</h4>
                                <p style="color: #1f2937; margin: 0; font-size: 18px; font-weight: 700;">₹${order.totalAmount}</p>
                            </div>
                            <div>
                                <h4 style="color: #065f46; margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Method</h4>
                                <p style="color: #1f2937; margin: 0; font-size: 16px; font-weight: 600;">${order.paymentMethod}</p>
                            </div>
                            <div>
                                <h4 style="color: #065f46; margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Expected Delivery</h4>
                                <p style="color: #1f2937; margin: 0; font-size: 16px; font-weight: 600;">${order.estimatedDelivery}</p>
                            </div>
                        </div>
                        
                        <!-- Order Status -->
                        <div style="background: #ffffff; border-radius: 10px; padding: 20px; border: 1px solid #d1fae5;">
                            <h4 style="color: #065f46; margin: 0 0 15px 0; font-size: 16px;">📦 Order Status Timeline</h4>
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <span style="background: #10b981; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 12px;">✓</span>
                                <span style="color: #059669; font-weight: 600;">Order Placed & Confirmed</span>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <span style="background: #fbbf24; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 12px;">2</span>
                                <span style="color: #92400e;">Preparing Your Order</span>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <span style="background: #e5e7eb; color: #6b7280; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 12px;">3</span>
                                <span style="color: #6b7280;">Out for Delivery</span>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <span style="background: #e5e7eb; color: #6b7280; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 12px;">4</span>
                                <span style="color: #6b7280;">Delivered</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Track Order Button -->
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order.orderNumber}" 
                           style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3); margin-right: 15px;">
                            🚚 Track Your Order
                        </a>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/invoice/${order.orderNumber}" 
                           style="display: inline-block; background: #ffffff; color: #059669; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; border: 2px solid #059669;">
                            📄 Download Invoice
                        </a>
                    </div>
                    
                    <!-- Delivery Information -->
                    <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 30px 0;">
                        <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🚚 Delivery Information</h3>
                        <ul style="color: #b45309; margin: 0; padding-left: 20px; line-height: 1.7;">
                            <li>Free delivery for orders above ₹499</li>
                            <li>Our delivery executive will call before arriving</li>
                            <li>Fresh groceries delivered in eco-friendly packaging</li>
                            <li>100% quality guarantee - return if not satisfied</li>
                        </ul>
                    </div>
                    
                    <!-- Contact Support -->
                    <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                        <h4 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 16px;">📞 Need Help with Your Order?</h4>
                        <p style="color: #0369a1; margin: 0; font-size: 14px; line-height: 1.6;">
                            <strong>Order Support:</strong> 1800-GROCERY (24/7)<br>
                            <strong>WhatsApp:</strong> +91-9876543210<br>
                            <strong>Email:</strong> orders@grocerrypoint.com
                        </p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #1f2937; padding: 30px; text-align: center;">
                    <div style="margin-bottom: 20px;">
                        <span style="color: #ffffff; font-size: 24px; margin-right: 10px;">🛒</span>
                        <span style="color: #ffffff; font-size: 20px; font-weight: 600;">GrocerryPoint</span>
                    </div>
                    <p style="color: #d1d5db; font-size: 14px; margin: 0 0 10px 0;">
                        <strong>Thank you for choosing GrocerryPoint!</strong>
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 15px 0;">
                        GrocerryPoint Private Limited • New Delhi, India<br>
                        Order ID: ${order.orderNumber} • Customer: ${user.email}
                    </p>
                    <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                        © 2025 GrocerryPoint. All rights reserved. Fresh groceries, delivered with care. 🥬
                    </p>
                </div>
                
            </div>
        </body>
        </html>
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

// Send order status update email
const sendOrderStatusUpdate = async (user, order, status) => {
  try {
    const transporter = createTransporter();
    
    const statusConfig = {
      'preparing': {
        icon: '👨‍🍳',
        title: 'Order Being Prepared',
        message: 'Our expert team is carefully selecting and packing your fresh groceries',
        color: '#f59e0b',
        bgColor: '#fef3c7'
      },
      'packed': {
        icon: '📦',
        title: 'Order Packed & Ready',
        message: 'Your order is packed with care and ready for dispatch',
        color: '#3b82f6',
        bgColor: '#dbeafe'
      },
      'shipped': {
        icon: '🚚',
        title: 'Order Shipped',
        message: 'Your fresh groceries are on the way! Our delivery partner is heading to you',
        color: '#8b5cf6',
        bgColor: '#ede9fe'
      },
      'out_for_delivery': {
        icon: '🛵',
        title: 'Out for Delivery',
        message: 'Your order is out for delivery and will reach you within the next 2 hours',
        color: '#10b981',
        bgColor: '#d1fae5'
      },
      'delivered': {
        icon: '✅',
        title: 'Order Delivered',
        message: 'Great! Your fresh groceries have been delivered successfully',
        color: '#059669',
        bgColor: '#ecfdf5'
      }
    };
    
    const currentStatus = statusConfig[status] || {
      icon: '📋',
      title: 'Order Updated',
      message: 'Your order status has been updated',
      color: '#6b7280',
      bgColor: '#f3f4f6'
    };
    
    const mailOptions = {
      from: `"GrocerryPoint Tracking" <${process.env.EMAIL_FROM || 'tracking@grocerrypoint.com'}>`,
      to: user.email,
      subject: `${currentStatus.icon} ${currentStatus.title} - Order #${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Update - GrocerryPoint</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            
            <!-- Main Container -->
            <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                
                <!-- Status Header -->
                <div style="background: linear-gradient(135deg, ${currentStatus.color} 0%, ${currentStatus.color}dd 100%); padding: 40px 30px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255,255,255,0.3);">
                        <span style="font-size: 35px;">${currentStatus.icon}</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${currentStatus.title}</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">Order #${order.orderNumber}</p>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 40px 30px; background-color: #ffffff;">
                    
                    <!-- Status Message -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 26px; font-weight: 600;">Hello ${user.name}! 👋</h2>
                        <p style="color: ${currentStatus.color}; font-size: 18px; font-weight: 500; margin: 0; line-height: 1.5;">${currentStatus.message}</p>
                    </div>
                    
                    <!-- Track Order Button -->
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order.orderNumber}" 
                           style="display: inline-block; background: linear-gradient(135deg, ${currentStatus.color}, ${currentStatus.color}dd); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.15);">
                            📱 Live Tracking
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #1f2937; padding: 30px; text-align: center;">
                    <div style="margin-bottom: 20px;">
                        <span style="color: #ffffff; font-size: 24px; margin-right: 10px;">🛒</span>
                        <span style="color: #ffffff; font-size: 20px; font-weight: 600;">GrocerryPoint</span>
                    </div>
                    <p style="color: #d1d5db; font-size: 14px; margin: 0 0 10px 0;">
                        <strong>Fresh Groceries, Delivered Fresh!</strong>
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 15px 0;">
                        GrocerryPoint Private Limited • New Delhi, India<br>
                        Tracking ID: ${order.orderNumber} • Customer: ${user.email}
                    </p>
                    <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                        © 2025 GrocerryPoint. All rights reserved. Track orders anytime at grocerrypoint.com 📱
                    </p>
                </div>
                
            </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Order status update email sent:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw new Error('Failed to send order status update email');  
  }
};

// Send general notification email
const sendNotificationEmail = async (userEmail, subject, message, type = 'info') => {
  try {
    const transporter = createTransporter();
    
    const typeConfig = {
      'success': { icon: '✅', color: '#059669', bgColor: '#ecfdf5' },
      'warning': { icon: '⚠️', color: '#f59e0b', bgColor: '#fef3c7' },
      'error': { icon: '❌', color: '#dc2626', bgColor: '#fee2e2' },
      'info': { icon: 'ℹ️', color: '#2563eb', bgColor: '#dbeafe' }
    };
    
    const config = typeConfig[type] || typeConfig['info'];
    
    const mailOptions = {
      from: `"GrocerryPoint Notifications" <${process.env.EMAIL_FROM || 'notifications@grocerrypoint.com'}>`,
      to: userEmail,
      subject: `${config.icon} ${subject} - GrocerryPoint`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notification - GrocerryPoint</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            
            <!-- Main Container -->
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 8px 20px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%); padding: 30px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 15px auto; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">${config.icon}</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">GrocerryPoint</h1>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px; background-color: #ffffff;">
                    <div style="background: ${config.bgColor}; border-left: 4px solid ${config.color}; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">${subject}</h2>
                        <p style="color: #374151; margin: 0; font-size: 16px; line-height: 1.6;">${message}</p>
                    </div>
                    
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                           style="display: inline-block; background: ${config.color}; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 14px;">
                            Visit GrocerryPoint
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #1f2937; padding: 25px; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © 2025 GrocerryPoint. All rights reserved.<br>
                        This email was sent to ${userEmail}
                    </p>
                </div>
                
            </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Notification email sent:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw new Error('Failed to send notification email');
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendEmailVerification,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendNotificationEmail
};