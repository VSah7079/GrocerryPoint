// Contact and Newsletter Controller
const nodemailer = require('nodemailer');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // You can change this to your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS  // Your email password or app password
    }
  });
};

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
exports.contact = async (req, res, next) => {
  try {
    const { name, email, message, subject = 'New Contact Form Submission' } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    const transporter = createTransporter();
    
    // Send email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'admin@grocerrypoint.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>Sent from GrocerryPoint Contact Form</small></p>
      `
    };

    // Send confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting GrocerryPoint',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Thank You for Contacting Us!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h4>Your Message:</h4>
            <p><strong>Subject:</strong> ${subject}</p>
            <p>${message}</p>
          </div>
          
          <p>Our support team typically responds within 24-48 hours.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            Best regards,<br>
            GrocerryPoint Team<br>
            🛒 Fresh & Fast
          </p>
        </div>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    res.json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon!'
    });
  } catch (err) {
    console.error('Email sending error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to send email. Please try again later.'
    });
  }
};

// @desc    Handle newsletter subscription
// @route   POST /api/newsletter
// @access  Public
exports.subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const transporter = createTransporter();
    
    // Send welcome newsletter email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎉 Welcome to GrocerryPoint Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #16a34a; text-align: center; margin-bottom: 30px;">
              🛒 Welcome to GrocerryPoint!
            </h1>
            
            <p style="font-size: 16px; line-height: 1.6;">Dear Subscriber,</p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for subscribing to our newsletter! You're now part of the GrocerryPoint family.
            </p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #16a34a;">
              <h3 style="color: #15803d; margin-top: 0;">What you'll get:</h3>
              <ul style="color: #374151; line-height: 1.8;">
                <li>🎯 Exclusive deals and discounts</li>
                <li>🥬 Fresh produce updates</li>
                <li>📱 New product announcements</li>
                <li>💡 Healthy recipe ideas</li>
                <li>⚡ Flash sale notifications</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                 style="background-color: #16a34a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Start Shopping Now
              </a>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Fresh & Fast delivery to your doorstep<br>
              GrocerryPoint Team<br>
              <a href="mailto:support@grocerrypoint.com" style="color: #16a34a;">support@grocerrypoint.com</a>
            </p>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
              If you didn't subscribe to this newsletter, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter! Check your email for confirmation.'
    });
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe to newsletter. Please try again later.'
    });
  }
};

// @desc    Send order confirmation email
// @route   POST /api/email/order-confirmation
// @access  Private (called internally)
exports.sendOrderConfirmation = async (orderData) => {
  try {
    const transporter = createTransporter();
    
    const { user, order, items } = orderData;
    
    // Calculate total items
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Generate items HTML
    const itemsHtml = items.map(item => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">${item.product.name}</td>
        <td style="padding: 12px; text-align: center;">₹${item.price}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Confirmation #${order._id} - GrocerryPoint`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; margin: 0;">🛒 GrocerryPoint</h1>
              <p style="color: #6b7280; margin: 5px 0;">Fresh & Fast</p>
            </div>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <h2 style="color: #15803d; margin: 0;">Order Confirmed! 🎉</h2>
              <p style="color: #374151; margin: 10px 0;">Thank you for your order, ${user.name}!</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h3 style="color: #374151; border-bottom: 2px solid #16a34a; padding-bottom: 8px;">Order Details</h3>
              <p><strong>Order ID:</strong> #${order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span style="color: #16a34a;">${order.status}</span></p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              <p><strong>Total Items:</strong> ${totalItems}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h3 style="color: #374151; border-bottom: 2px solid #16a34a; padding-bottom: 8px;">Items Ordered</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #d1d5db;">Product</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #d1d5db;">Price</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #d1d5db;">Qty</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #d1d5db;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: #374151; margin: 0;">Total Amount:</h3>
                <h2 style="color: #16a34a; margin: 0;">₹${order.totalAmount}</h2>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/account/orders" 
                 style="background-color: #16a34a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-right: 10px;">
                Track Your Order
              </a>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                 style="border: 2px solid #16a34a; color: #16a34a; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Continue Shopping
              </a>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 14px;">
                Questions about your order?<br>
                Contact us at <a href="mailto:support@grocerrypoint.com" style="color: #16a34a;">support@grocerrypoint.com</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
                GrocerryPoint - Fresh groceries delivered to your doorstep
              </p>
            </div>
            
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${user.email} for order #${order._id}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// @desc    Send welcome email for new users
// @route   POST /api/email/welcome
// @access  Private (called internally)
exports.sendWelcomeEmail = async (userData) => {
  try {
    const transporter = createTransporter();
    
    const { name, email } = userData;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎉 Welcome to GrocerryPoint Family!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; margin: 0;">🛒 GrocerryPoint</h1>
              <p style="color: #6b7280; margin: 5px 0;">Fresh & Fast</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #16a34a;">Welcome to the Family! 🎉</h2>
              <p style="font-size: 16px; color: #374151;">Hi ${name},</p>
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Welcome to GrocerryPoint! We're excited to have you on board. Get ready for fresh groceries delivered right to your doorstep.
              </p>
            </div>
            
            <div style="background-color: #f0fdf4; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #15803d; margin-top: 0; text-align: center;">🎁 Special Welcome Offer!</h3>
              <div style="text-align: center; background-color: white; padding: 20px; border-radius: 6px; border: 2px dashed #16a34a;">
                <h2 style="color: #16a34a; margin: 0;">₹100 OFF</h2>
                <p style="margin: 10px 0; color: #374151;">On your first order above ₹500</p>
                <div style="background-color: #16a34a; color: white; padding: 8px 16px; border-radius: 4px; display: inline-block; font-weight: bold; font-family: monospace;">
                  WELCOME100
                </div>
              </div>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #374151; text-align: center;">Why Choose GrocerryPoint?</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                <div style="text-align: center; padding: 15px;">
                  <div style="font-size: 24px; margin-bottom: 8px;">🥬</div>
                  <h4 style="color: #374151; margin: 8px 0;">Fresh Produce</h4>
                  <p style="color: #6b7280; font-size: 14px;">Hand-picked fresh fruits and vegetables</p>
                </div>
                <div style="text-align: center; padding: 15px;">
                  <div style="font-size: 24px; margin-bottom: 8px;">⚡</div>
                  <h4 style="color: #374141; margin: 8px 0;">Fast Delivery</h4>
                  <p style="color: #6b7280; font-size: 14px;">Same-day delivery available</p>
                </div>
                <div style="text-align: center; padding: 15px;">
                  <div style="font-size: 24px; margin-bottom: 8px;">💰</div>
                  <h4 style="color: #374151; margin: 8px 0;">Best Prices</h4>
                  <p style="color: #6b7280; font-size: 14px;">Competitive prices with regular deals</p>
                </div>
                <div style="text-align: center; padding: 15px;">
                  <div style="font-size: 24px; margin-bottom: 8px;">🏆</div>
                  <h4 style="color: #374151; margin: 8px 0;">Quality Guaranteed</h4>
                  <p style="color: #6b7280; font-size: 14px;">100% quality guarantee or money back</p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" 
                 style="background-color: #16a34a; color: white; padding: 15px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Start Shopping Now
              </a>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 14px;">
                Need help getting started?<br>
                Contact our support team at <a href="mailto:support@grocerrypoint.com" style="color: #16a34a;">support@grocerrypoint.com</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
                Happy Shopping!<br>
                The GrocerryPoint Team
              </p>
            </div>
            
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};
