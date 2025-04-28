import { Request, Response } from 'express';
import axios from 'axios';
import ChatMessage from '../models/ChatMessage';
import Session from '../models/Session';
import logger from '../utils/logger';

// Send a message to the AI service and store the conversation
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { query, sessionId } = req.body;
    
    if (!query || !sessionId) {
      return res.status(400).json({ message: 'Query and sessionId are required' });
    }
    
    // Check if session exists, create if not
    let session = await Session.findOne({ sessionId });
    
    if (!session) {
      session = new Session({
        sessionId,
        userId: req.user?._id
      });
      await session.save();
    } else {
      // Update session activity
      session.lastActivity = new Date();
      await session.save();
    }
    
    // Save user message
    const userMessage = new ChatMessage({
      sessionId,
      content: query,
      isUser: true,
      userId: req.user?._id,
      timestamp: new Date()
    });
    
    await userMessage.save();
    
    // Send request to AI service
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const aiResponse = await axios.post(`${aiServiceUrl}/chat`, {
      query,
      session_id: sessionId
    });
    
    // Extract response data
    const { response: botResponse, sentiment } = aiResponse.data;
    
    // Save bot response
    const botMessage = new ChatMessage({
      sessionId,
      content: botResponse,
      isUser: false,
      userId: req.user?._id,
      timestamp: new Date(),
      sentiment
    });
    
    await botMessage.save();
    
    // Return response
    res.json({
      response: botResponse,
      sentiment,
      sessionId
    });
  } catch (error) {
    logger.error('Send message error', error);
    res.status(500).json({ message: 'Error processing message' });
  }
};

// Get chat history for a session
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    // Get messages for session, ordered by timestamp
    const messages = await ChatMessage.find({ sessionId })
      .sort({ timestamp: 1 });
    
    res.json({
      sessionId,
      messages: messages.map(msg => ({
        id: msg._id,
        content: msg.content,
        isUser: msg.isUser,
        timestamp: msg.timestamp,
        sentiment: msg.sentiment
      }))
    });
  } catch (error) {
    logger.error('Get chat history error', error);
    res.status(500).json({ message: 'Error retrieving chat history' });
  }
};

// Get all available sessions
export const getSessions = async (req: Request, res: Response) => {
  try {
    // Find all sessions for user
    const sessions = await Session.find({ 
      userId: req.user?._id,
      isActive: true
    }).sort({ lastActivity: -1 });
    
    res.json({
      sessions: sessions.map(session => session.sessionId)
    });
  } catch (error) {
    logger.error('Get sessions error', error);
    res.status(500).json({ message: 'Error retrieving sessions' });
  }
};

// Delete a chat session
export const deleteSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    // Verify session belongs to user
    const session = await Session.findOne({ 
      sessionId, 
      userId: req.user?._id 
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Mark session as inactive
    session.isActive = false;
    await session.save();
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    logger.error('Delete session error', error);
    res.status(500).json({ message: 'Error deleting session' });
  }
};