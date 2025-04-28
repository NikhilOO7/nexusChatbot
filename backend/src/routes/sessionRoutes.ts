import express from 'express';
import { 
  getUserSessions, 
  createSession, 
  updateSessionActivity, 
  endSession 
} from '../controllers/sessionController';
import { auth } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/sessions
// @desc    Get all sessions for a user
// @access  Private
router.get('/', auth, getUserSessions);

// @route   POST /api/sessions
// @desc    Create a new session
// @access  Private
router.post('/', auth, createSession);

// @route   PUT /api/sessions/:sessionId/activity
// @desc    Update session activity
// @access  Private
router.put('/:sessionId/activity', auth, updateSessionActivity);

// @route   PUT /api/sessions/:sessionId/end
// @desc    End a session
// @access  Private
router.put('/:sessionId/end', auth, endSession);

export default router;