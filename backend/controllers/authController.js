const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    const user = await User.create({ name, email, password, phone, dateOfBirth, gender });
    const token = generateToken(user);
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
          role: user.role 
        },
        token
      }
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
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
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
          role: user.role 
        },
        token
      }
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