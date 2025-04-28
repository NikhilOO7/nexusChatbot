import mongoose, { Schema, Document } from 'mongoose';

// Chat message interface
export interface IChatMessage extends Document {
  sessionId: string;
  content: string;
  isUser: boolean;
  userId?: mongoose.Types.ObjectId;
  timestamp: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
  metadata?: Record<string, any>;
}

// Chat message schema
const ChatMessageSchema: Schema = new Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  isUser: {
    type: Boolean,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral']
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
});

// Create compound index for efficient queries
ChatMessageSchema.index({ sessionId: 1, timestamp: 1 });

// Export ChatMessage model
const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
export default ChatMessage;