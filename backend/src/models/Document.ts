import mongoose, { Schema, Document } from 'mongoose';

// Document interface
export interface IDocument extends Document {
  title: string;
  description: string;
  content: string;
  category?: string;
  tags?: string[];
  fileType: string;
  fileSize: number;
  uploadedBy?: mongoose.Types.ObjectId;
  uploadedAt: Date;
  updatedAt: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
}

// Document schema
const DocumentSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    index: true
  },
  tags: [{
    type: String,
    index: true
  }],
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
});

// Update timestamps
DocumentSchema.pre<IDocument>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create text index for search
DocumentSchema.index({ 
  title: 'text', 
  description: 'text', 
  content: 'text' 
});

// Export Document model
const KnowledgeDocument = mongoose.model<IDocument>('KnowledgeDocument', DocumentSchema);
export default KnowledgeDocument;