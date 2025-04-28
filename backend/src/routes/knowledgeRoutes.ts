import express from 'express';
import { 
  uploadDocuments, 
  getCategories, 
  createCategory, 
  getDocuments,
  getRelatedDocuments
} from '../controllers/knowledgeController';
import { auth, adminOnly } from '../middleware/auth';
import { upload } from '../controllers/knowledgeController';

const router = express.Router();

// @route   POST /api/knowledge/upload
// @desc    Upload documents
// @access  Private
router.post('/upload', auth, upload.array('files', 10), uploadDocuments);

// @route   GET /api/knowledge/categories
// @desc    Get all categories
// @access  Private
router.get('/categories', auth, getCategories);

// @route   POST /api/knowledge/categories
// @desc    Create a new category
// @access  Private (admin only)
router.post('/categories', [auth, adminOnly], createCategory);

// @route   GET /api/knowledge/documents
// @desc    Get documents
// @access  Private
router.get('/documents', auth, getDocuments);

// @route   GET /api/knowledge/related/:sessionId
// @desc    Get related documents for a chat session
// @access  Private
router.get('/related/:sessionId', auth, getRelatedDocuments);

export default router;