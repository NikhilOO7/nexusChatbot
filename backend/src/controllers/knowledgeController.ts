import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import KnowledgeDocument from '../models/Document';
import Category from '../models/Category';
import logger from '../utils/logger';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common document types
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  }
});

// Upload documents
export const uploadDocuments = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const { title, description, category } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Document title is required' });
    }
    
    const files = req.files as Express.Multer.File[];
    const uploadedDocuments = [];
    
    // Process each file
    for (const file of files) {
      // Read file content
      const filePath = file.path;
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Create document record
      const document = new KnowledgeDocument({
        title: files.length > 1 ? `${title} - ${file.originalname}` : title,
        description: description || '',
        content,
        category: category || undefined,
        fileType: file.mimetype,
        fileSize: file.size,
        uploadedBy: req.user?._id
      });
      
      await document.save();
      uploadedDocuments.push(document);
      
      // Send to AI service for indexing
      try {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        await axios.post(`${aiServiceUrl}/index`, {
          document_id: document._id,
          content,
          title: document.title,
          metadata: {
            category: document.category
          }
        });
      } catch (indexError) {
        logger.error('Error indexing document', indexError);
        // Continue even if indexing fails
      }
    }
    
    res.status(201).json({
      message: 'Documents uploaded successfully',
      documentId: uploadedDocuments[0]._id,
      count: uploadedDocuments.length
    });
  } catch (error) {
    logger.error('Document upload error', error);
    res.status(500).json({ message: 'Error uploading documents' });
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true });
    
    res.json(
      categories.map(category => ({
        id: category._id,
        name: category.name,
        description: category.description
      }))
    );
  } catch (error) {
    logger.error('Get categories error', error);
    res.status(500).json({ message: 'Error retrieving categories' });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    // Create category
    const category = new Category({
      name,
      description: description || '',
      createdBy: req.user?._id
    });
    
    await category.save();
    
    res.status(201).json({
      id: category._id,
      name: category.name,
      description: category.description
    });
  } catch (error) {
    logger.error('Create category error', error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Get documents
export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { category, query } = req.query;
    const filter: any = { isActive: true };
    
    // Apply category filter if provided
    if (category) {
      filter.category = category;
    }
    
    // Apply search query if provided
    if (query) {
      filter.$text = { $search: query as string };
    }
    
    // Get documents
    const documents = await KnowledgeDocument.find(filter)
      .sort({ updatedAt: -1 })
      .limit(50);
    
    res.json(
      documents.map(doc => ({
        id: doc._id,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        fileType: doc.fileType,
        updatedAt: doc.updatedAt
      }))
    );
  } catch (error) {
    logger.error('Get documents error', error);
    res.status(500).json({ message: 'Error retrieving documents' });
  }
};

// Get related documents for a chat session
export const getRelatedDocuments = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    
    // Call AI service to get related document IDs
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const relatedResponse = await axios.get(`${aiServiceUrl}/related/${sessionId}`);
    
    const relatedDocIds = relatedResponse.data.document_ids || [];
    
    if (relatedDocIds.length === 0) {
      return res.json({ articles: [] });
    }
    
    // Get related documents
    const documents = await KnowledgeDocument.find({
      _id: { $in: relatedDocIds },
      isActive: true
    });
    
    res.json({
      articles: documents.map((doc, index) => ({
        id: doc._id,
        title: doc.title,
        url: `/api/knowledge/documents/${doc._id}`,
        relevance: (relatedResponse.data.scores || [])[index] || 0.5
      }))
    });
  } catch (error) {
    logger.error('Get related documents error', error);
    res.status(500).json({ message: 'Error retrieving related documents' });
  }
};