import express from 'express';
import { 
  sendMessage, 
  getChatHistory, 
  getSessions,
  deleteSession
} from '../controllers/chatController';
import { auth } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/chat
// @desc    Send a message to the chatbot
// @access  Public/Private (can work with or without auth)
router.post('/', sendMessage);

// @route   GET /api/chat/history/:sessionId
// @desc    Get chat history for a session
// @access  Public/Private
router.get('/history/:sessionId', getChatHistory);

// @route   GET /api/chat/sessions
// @desc    Get all available sessions
// @access  Private
router.get('/sessions', auth, getSessions);

// @route   DELETE /api/chat/sessions/:sessionId
// @desc    Delete a chat session
// @access  Private
router.delete('/sessions/:sessionId', auth, deleteSession);

export default router;