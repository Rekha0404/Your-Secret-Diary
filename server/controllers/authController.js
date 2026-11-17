const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'secret_diary_super_secret_key_2026';
  return jwt.sign({ userId }, secret, { expiresIn: '30d' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, theme } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      theme: theme || 'dreamy',
    });

    const userId = String(user._id || user.id);
    const token = generateToken(userId);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully ♡',
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        theme: user.theme,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during signup.',
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Hmm... those details don't match this diary ♡",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Hmm... those details don't match this diary ♡",
      });
    }

    const userId = String(user._id || user.id);
    const token = generateToken(userId);

    return res.status(200).json({
      success: true,
      message: 'Welcome back to your diary ♡',
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        theme: user.theme || 'dreamy',
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not fetch user details.',
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, theme } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (theme) updates.theme = theme;

    const updatedUser = await User.findByIdAndUpdate(req.userId, updates, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Profile updated ♡',
      user: {
        id: String(updatedUser._id || updatedUser.id),
        name: updatedUser.name,
        email: updatedUser.email,
        theme: updatedUser.theme,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not update profile.',
      error: error.message,
    });
  }
};
