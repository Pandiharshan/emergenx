// Updated: 2025-12-19 12:07:24 - feat: optimize ui authentication
// Updated: 2025-12-19 12:07:21 - test: add patient triage system
// Updated: 2025-12-19 12:07:15 - docs: refactor api error handling
// Updated: 2025-12-19 12:07:14 - test: enhance api patient form
// Updated: 2025-12-19 12:07:12 - docs(database): implement API endpoints
// Updated: 2025-12-19 12:07:08 - test(database): refactor database error handling
// Updated: 2025-12-19 12:06:55 - chore(validation): implement API endpoints in validation
// Updated: 2025-12-19 12:06:52 - fix: implement socket dashboard (fixes #43)
// Updated: 2025-12-19 12:06:18 - chore(auth): update auth triage system
// Updated: 2025-12-19 12:05:59 - chore(validation): update database schema
// Updated: 2025-12-19 12:05:57 - docs(validation): implement triage system in validation
// Updated: 2025-12-19 12:05:55 - test(validation): improve triage system in validation
// Updated: 2025-12-19 12:05:41 - perf(api): optimize api authentication (fixes #29)
// Updated: 2025-12-19 12:05:32 - fix: implement auth database schema
// Updated: 2025-12-19 12:05:03 - fix(validation): update validation UI components
// Updated: 2025-12-19 12:05:00 - style(patient): refactor patient database schema
// Updated: 2025-12-19 12:05:00 - chore(api): enhance UI components
// Updated: 2025-12-19 12:04:56 - docs(triage): update error handling in triage
// Updated: 2025-12-19 12:04:51 - feat: fix ui API endpoints
// Updated: 2025-12-19 12:04:40 - fix(auth): implement authentication (fixes #29)
// Updated: 2025-12-19 12:04:26 - feat(api): fix dashboard in api
// Updated: 2025-12-19 12:04:20 - perf(patient): optimize authentication in patient
// Updated: 2025-12-19 12:04:16 - chore(ui): enhance UI components
// Updated: 2025-12-19 12:04:15 - fix: optimize triage database schema
// Updated: 2025-12-19 12:03:56 - refactor(triage): improve triage system
// Updated: 2025-12-19 12:03:45 - feat(patient): refactor patient dashboard (fixes #43)
// Updated: 2025-12-19 12:03:28 - style(validation): enhance validation error handling
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create new user (password will be hashed by the User model pre-save middleware)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

export { registerUser, loginUser };


























