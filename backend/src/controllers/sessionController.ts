import { Request, Response } from 'express';
import Session from '../models/Session';
import logger from '../utils/logger';

// Get all sessions for a user
export const getUserSessions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const sessions = await Session.find({ 
      userId: req.user._id,
      isActive: true
    }).sort({ lastActivity: -1 });
    
    res.json({
      sessions: sessions.map(session => ({
        id: session.sessionId,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity
      }))
    });
  } catch (error) {
    logger.error('Get sessions error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new session
export const createSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    
    // Check if session already exists
    const existingSession = await Session.findOne({ sessionId });
    
    if (existingSession) {
      return res.status(400).json({ message: 'Session already exists' });
    }
    
    // Create new session
    const session = new Session({
      sessionId,
      userId: req.user?._id
    });
    
    await session.save();
    
    res.status(201).json({
      session: {
        id: session.sessionId,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity
      }
    });
  } catch (error) {
    logger.error('Create session error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update session activity
export const updateSessionActivity = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    // Find session
    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Update last activity
    session.lastActivity = new Date();
    await session.save();
    
    res.json({
      session: {
        id: session.sessionId,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity
      }
    });
  } catch (error) {
    logger.error('Update session error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// End session
export const endSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    // Find session
    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Set session as inactive
    session.isActive = false;
    await session.save();
    
    res.json({ message: 'Session ended successfully' });
  } catch (error) {
    logger.error('End session error', error);
    res.status(500).json({ message: 'Server error' });
  }
};