import express from 'express';
import {
  initiateCall,
  answerCall,
  endCall,
  rejectCall,
  getCallHistory,
  getActiveCalls,
  addContact,
  getContacts
} from '../controllers/callController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Call management routes
router.post('/initiate', authMiddleware, initiateCall);
router.put('/:callId/answer', authMiddleware, answerCall);
router.put('/:callId/end', authMiddleware, endCall);
router.put('/:callId/reject', authMiddleware, rejectCall);

// Call history and active calls
router.get('/history', authMiddleware, getCallHistory);
router.get('/active', authMiddleware, getActiveCalls);

// Contact management routes
router.post('/contacts', authMiddleware, addContact);
router.get('/contacts', authMiddleware, getContacts);

export default router;
