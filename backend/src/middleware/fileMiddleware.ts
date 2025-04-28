import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

// Middleware to parse text files
export const parseTextFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }
  
  const filePath = req.file.path;
  const fileExt = path.extname(filePath).toLowerCase();
  
  // Only process text files
  if (fileExt === '.txt') {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      req.body.content = fileContent;
    } catch (error) {
      return res.status(400).json({ message: 'Error parsing text file' });
    }
  }
  
  next();
};

// Helper function to get MIME type from file extension
export const getMimeType = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  
  const mimeTypes: { [key: string]: string } = {
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.csv': 'text/csv'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
};