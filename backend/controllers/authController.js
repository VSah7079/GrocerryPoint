const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendEmailVerification } = require('../services/emailService');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and password are required.' 
      });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        error: 'Email already registered.' 
      });
    }
    
    const user = await User.create({ name, email, password, phone, dateOfBirth, gender });
    
    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    
    // Send verification email (don't block registration if email fails)
    try {
      await sendEmailVerification(user, verificationToken);
    } catch (emailError) {
      console.log('Failed to send verification email:', emailError.message);
    }
    
    // Don't auto-login - user must verify email first
    res.status(201).json({
      success: true,
      data: {
        user: { 
          _id: user._id, 
          name: user.name, 
          email: user.email, 
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          role: user.role,
          isVerified: user.isVerified
        }
      },
      message: 'Account created successfully! Please check your email and verify your account before logging in.',
      requiresVerification: true
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email or password.' 
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email or password.' 
      });
    }
    
    // Check if email is verified (except for admin users)
    if (!user.isVerified && user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Please verify your email address before logging in.',
        requiresVerification: true,
        email: user.email
      });
    }
    
    const token = generateToken(user);
    res.json({
      success: true,
      data: {
        user: { 
          _id: user._id, 
          name: user.name, 
          email: user.email, 
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          role: user.role,
          isVerified: user.isVerified 
        },
        token
      },
      message: 'Login successful!'
    });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, dateOfBirth, gender, preferences } = req.body;
    const userId = req.user.id;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (preferences) updateData.preferences = preferences;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: { user },
      message: 'Profile updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc Forgot password
// @route POST /api/auth/forgot-password
// @access Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with that email address'
      });
    }
    
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    
    await user.save({ validateBeforeSave: false });
    
    try {
      await sendPasswordResetEmail(user, resetToken);
      
      res.json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        success: false,
        error: 'Email could not be sent'
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc Reset password
// @route POST /api/auth/reset-password/:resettoken
// @access Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }
    
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }
    
    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    
    // Generate JWT token for immediate login
    const token = generateToken(user);
    
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      },
      message: 'Password reset successful'
    });
  } catch (err) {
    next(err);
  }
};

// @desc Verify email
// @route POST /api/auth/verify-email/:token
// @access Public
exports.verifyEmail = async (req, res, next) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    
    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token'
      });
    }
    
    // Mark email as verified
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Email verified successfully! You can now login to your account.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc Resend email verification
// @route POST /api/auth/resend-verification
// @access Public
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with that email address'
      });
    }
    
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified. You can now login to your account.'
      });
    }
    
    // Rate limiting - prevent spam requests
    if (user.emailVerificationExpire && user.emailVerificationExpire > Date.now()) {
      const timeLeft = Math.ceil((user.emailVerificationExpire - Date.now()) / (1000 * 60));
      return res.status(429).json({
        success: false,
        error: `Please wait ${timeLeft} minutes before requesting another verification email`
      });
    }
    
    // Get verification token
    const verificationToken = user.getEmailVerificationToken();
    
    await user.save({ validateBeforeSave: false });
    
    try {
      await sendEmailVerification(user, verificationToken);
      
      res.json({
        success: true,
        message: 'New verification email sent successfully. Please check your inbox and spam folder.',
        email: user.email
      });
    } catch (error) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email. Please try again later.'
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc Check email verification status
// @route POST /api/auth/check-verification
// @access Public
exports.checkVerificationStatus = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }
    
    const user = await User.findOne({ email }).select('name email isVerified role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with that email address'
      });
    }
    
    res.json({
      success: true,
      data: {
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        canLogin: user.isVerified || user.role === 'admin',
        role: user.role
      },
      message: user.isVerified ? 'Email is verified. You can login now.' : 'Email verification pending.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc Admin login
// @route POST /api/auth/admin-login
// @access Public
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    // Check if user exists and is an admin
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin credentials'
      });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        },
        token
      },
      message: 'Admin login successful'
    });
  } catch (err) {
    next(err);
  }
};