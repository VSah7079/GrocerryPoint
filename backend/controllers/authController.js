const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, phone, dateOfBirth, gender });
    const token = generateToken(user);
    
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        role: user.role,
        preferences: user.preferences || {},
        socialLogin: user.socialLogin || false,
        isEmailVerified: user.isEmailVerified || false
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Admin login attempt:', { email }); // Debug log

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find the user
    const user = await User.findOne({ email }).select('+password');
    
    console.log('Found user:', user ? 'Yes' : 'No'); // Debug log

    if (!user || user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or insufficient permissions'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log('Password match:', isMatch); // Debug log

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Send response without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      success: true,
      user: userResponse,
      token
    });

    // Send response
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Send response
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        role: user.role,
        preferences: user.preferences || {},
        socialLogin: user.socialLogin || false,
        isEmailVerified: user.isEmailVerified || false
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Social login success handler
exports.socialLoginSuccess = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: 'Authentication failed' });
    }

    const token = generateToken(user);
    
    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      preferences: user.preferences,
      role: user.role,
      socialLogin: user.socialLogin,
      isEmailVerified: user.isEmailVerified
    }))}`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Social login error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
  }
};

// Social login failure handler
exports.socialLoginFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, gender, preferences } = req.body;
    
    // Find user by ID from the token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (preferences) user.preferences = preferences;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        preferences: updatedUser.preferences,
        role: updatedUser.role,
        socialLogin: updatedUser.socialLogin,
        isEmailVerified: updatedUser.isEmailVerified
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}; 