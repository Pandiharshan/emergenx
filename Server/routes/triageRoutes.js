import express from 'express';
import { analyzeSymptoms, getTriageHistory, getTriageResult } from '../Controllers/triageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/triage/
// @desc    Analyze symptoms and provide diagnosis
// @access  Private
router.post('/', authMiddleware, analyzeSymptoms);

// @route   GET /api/triage/history
// @desc    Get triage history for logged-in user
// @access  Private
router.get('/history', authMiddleware, getTriageHistory);

// @route   GET /api/triage/results/:id
// @desc    Get single triage result by ID
// @access  Private
router.get('/results/:id', authMiddleware, getTriageResult);

export default router;