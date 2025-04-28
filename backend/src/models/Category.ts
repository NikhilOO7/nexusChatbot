import mongoose, { Schema, Document } from 'mongoose';

// Category interface
export interface ICategory extends Document {
  name: string;
  description?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Category schema
const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
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
  }
});

// Update timestamps
CategorySchema.pre<ICategory>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Export Category model
const Category = mongoose.model<ICategory>('Category', CategorySchema);
export default Category;