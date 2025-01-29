// Updated: 2025-12-19 12:04:08 - feat: add validation dashboard (fixes #4)
// Updated: 2025-12-19 12:04:05 - perf(database): optimize authentication in database (fixes #7)
// Updated: 2025-12-19 12:03:50 - docs(triage): implement database schema (fixes #43)
// Updated: 2025-12-19 12:03:45 - fix(auth): add dashboard in auth
// Updated: 2025-12-19 12:03:30 - perf(api): add dashboard in api
// Updated: 2025-12-19 12:03:25 - style(database): implement database API endpoints
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

export default router;





