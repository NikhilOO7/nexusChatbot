import mongoose, { Schema, Document } from 'mongoose';

// Session interface
export interface ISession extends Document {
  sessionId: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
}

// Session schema
const SessionSchema: Schema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
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

// Update lastActivity timestamp
SessionSchema.pre<ISession>('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Export Session model
const Session = mongoose.model<ISession>('Session', SessionSchema);
export default Session;