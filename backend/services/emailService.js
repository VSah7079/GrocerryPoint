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

// Send password reset email with working button
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
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f8fafc;">
            
            <!-- Main Container -->
            <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                
                <!-- Security Header -->
                <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%); padding: 40px 30px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255,255,255,0.3);">
                        <span style="font-size: 35px;">🔐</span>
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
                    
                    <!-- MAIN RESET BUTTON - Table-based for email client compatibility -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0;">
                        <tr>
                            <td align="center">
                                <table cellpadding="0" cellspacing="0" border="0" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);">
                                    <tr>
                                        <td style="background: #dc2626; border-radius: 8px; padding: 0;">
                                            <a href="${resetUrl}" 
                                               style="display: block; background: #dc2626; color: #ffffff; padding: 20px 50px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 20px; font-family: Arial, Helvetica, sans-serif; text-align: center; line-height: 1.2; border: none;"
                                               target="_blank">
                                                🔐 RESET MY PASSWORD NOW
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <p style="color: #ef4444; font-size: 13px; margin: 0; font-weight: 600;">
                            ⏰ This secure link expires in 1 hour for your security
                        </p>
                    </div>
                    
                    <!-- Alternative Link for email clients that don't show buttons -->
                    <div style="background: #fee2e2; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #ef4444;">
                        <p style="color: #991b1b; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                            🔗 Button not working? Copy and paste this link in your browser:
                        </p>
                        <p style="color: #dc2626; font-size: 12px; word-break: break-all; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #d1d5db; font-family: monospace; overflow-x: auto;">
                            ${resetUrl}
                        </p>
                    </div>
                    
                    <!-- Simple Instructions -->
                    <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                        <h3 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 16px;">📋 How to Reset:</h3>
                        <ol style="color: #0f172a; margin: 0; padding-left: 20px; line-height: 1.6;">
                            <li>Click the red "RESET MY PASSWORD NOW" button above</li>
                            <li>Enter your new password (minimum 6 characters)</li>
                            <li>Confirm your new password</li>
                            <li>You'll be automatically logged in</li>
                        </ol>
                    </div>
                    
                    <!-- Security Notice -->
                    <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px; padding: 15px; margin: 20px 0;">
                        <p style="color: #dc2626; margin: 0; font-size: 13px; font-weight: 500;">
                            🔒 <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact our support team immediately.
                        </p>
                    </div>
                    
                    <!-- Contact Support -->
                    <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                        <h4 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 16px;">📞 Need Help?</h4>
                        <p style="color: #0369a1; margin: 0; font-size: 14px; line-height: 1.6;">
                            <strong>Security Helpline:</strong> 1800-SECURITY (24/7)<br>
                            <strong>Email:</strong> security@grocerrypoint.com<br>
                            <strong>Live Chat:</strong> Available on our website
                        </p>
                    </div>
                </div>
                
                <!-- Footer -->
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
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f8fafc;">
            
            <!-- Main Container -->
            <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); padding: 40px 30px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255,255,255,0.2);">
                        <span style="font-size: 35px;">🛒</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">GrocerryPoint</h1>
                    <p style="color: #dcfce7; margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">Welcome to our family!</p>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 40px 30px; background-color: #ffffff;">
                    
                    <!-- Welcome Message -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 26px; font-weight: 600;">Welcome ${user.name}! 🎉</h2>
                        <p style="color: #059669; font-size: 18px; font-weight: 500; margin: 0;">Please verify your email to get started</p>
                    </div>
                    
                    <!-- Verification Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0;">
                        <tr>
                            <td align="center">
                                <table cellpadding="0" cellspacing="0" border="0" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);">
                                    <tr>
                                        <td style="background: #10b981; border-radius: 8px; padding: 0;">
                                            <a href="${verifyUrl}" 
                                               style="display: block; background: #10b981; color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; font-family: Arial, Helvetica, sans-serif; text-align: center;"
                                               target="_blank">
                                                ✅ VERIFY MY EMAIL NOW
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    
                    <!-- Alternative Link -->
                    <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #10b981;">
                        <p style="color: #065f46; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
                            🔗 Button not working? Copy this link:
                        </p>
                        <p style="color: #059669; font-size: 13px; word-break: break-all; background: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db; font-family: monospace;">
                            ${verifyUrl}
                        </p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #1f2937; padding: 30px; text-align: center;">
                    <p style="color: #d1d5db; font-size: 14px; margin: 0 0 10px 0;">
                        <strong>GrocerryPoint Private Limited</strong>
                    </p>
                    <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                        © 2025 GrocerryPoint. All rights reserved.
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
        <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #059669;">Order Confirmed!</h2>
                <p>Hello ${user.name},</p>
                <p>Your order #${order.orderNumber} has been confirmed.</p>
                <p>Total Amount: ₹${order.totalAmount}</p>
                <p>Thank you for shopping with GrocerryPoint!</p>
            </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    throw new Error('Failed to send order confirmation email');
  }
};

// Send order status update email
const sendOrderStatusUpdate = async (user, order, status) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"GrocerryPoint Tracking" <${process.env.EMAIL_FROM || 'tracking@grocerrypoint.com'}>`,
      to: user.email,
      subject: `📦 Order Update - ${status} - Order #${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #059669;">Order Status Update</h2>
                <p>Hello ${user.name},</p>
                <p>Your order #${order.orderNumber} is now: <strong>${status}</strong></p>
                <p>Thank you for choosing GrocerryPoint!</p>
            </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending status update:', error);
    throw new Error('Failed to send order status update email');
  }
};

// Send general notification email
const sendNotificationEmail = async (userEmail, subject, message, type = 'info') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"GrocerryPoint Notifications" <${process.env.EMAIL_FROM || 'notifications@grocerrypoint.com'}>`,
      to: userEmail,
      subject: `${subject} - GrocerryPoint`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #059669;">${subject}</h2>
                <p>${message}</p>
                <p>Best regards,<br>GrocerryPoint Team</p>
            </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending notification:', error);
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