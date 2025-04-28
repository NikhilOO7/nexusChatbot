import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message } from '../types/chat';
import { chatApi } from '../services/api';

interface ConversationContextType {
  currentSessionId: string;
  sessions: string[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  startNewSession: () => void;
  loadSession: (sessionId: string) => Promise<void>;
}

// Create the context with a proper default value
const ConversationContext = createContext<ConversationContextType>({
  currentSessionId: '',
  sessions: [],
  messages: [],
  isLoading: false,
  error: null,
  sendMessage: async () => {},
  startNewSession: () => {},
  loadSession: async () => {}
});

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [sessions, setSessions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with stored session or create new one
  useEffect(() => {
    const initSession = async () => {
      try {
        // Try to get the last session from localStorage
        const storedSessionId = localStorage.getItem('lastChatSession');
        
        if (storedSessionId) {
          await loadSession(storedSessionId);
        } else {
          startNewSession();
        }
        
        // Load available sessions
        const sessionsResponse = await chatApi.getSessions();
        setSessions(sessionsResponse.sessions || []);
      } catch (err) {
        console.error('Error initializing session:', err);
        setError('Failed to initialize chat session');
        // Create a new session as fallback
        startNewSession();
      }
    };
    
    initSession();
  }, []);

  // Load messages for a specific session
  const loadSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentSessionId(sessionId);
      localStorage.setItem('lastChatSession', sessionId);
      
      const response = await chatApi.getHistory(sessionId);
      
      if (response.messages && response.messages.length > 0) {
        // Convert date strings to Date objects
        const formattedMessages = response.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } else {
        // If no messages, add welcome message
        setMessages([{
          id: '1',
          content: `Hello! I'm your AI customer support assistant. How can I help you today?`,
          isUser: false,
          timestamp: new Date(),
          sentiment: 'positive'
        }]);
      }
    } catch (err) {
      console.error('Error loading session:', err);
      setError('Failed to load session messages');
      // Add a fallback welcome message
      setMessages([{
        id: '1',
        content: `Hello! I'm your AI customer support assistant. How can I help you today?`,
        isUser: false,
        timestamp: new Date(),
        sentiment: 'positive'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new conversation session
  const startNewSession = () => {
    try {
      const newSessionId = crypto.randomUUID();
      setCurrentSessionId(newSessionId);
      localStorage.setItem('lastChatSession', newSessionId);
      
      // Reset messages and add welcome message
      setMessages([{
        id: '1',
        content: `Hello! I'm your AI customer support assistant. How can I help you today?`,
        isUser: false,
        timestamp: new Date(),
        sentiment: 'positive'
      }]);
      
      // Update sessions list
      setSessions(prev => [newSessionId, ...prev]);
    } catch (err) {
      console.error('Error starting new session:', err);
      setError('Failed to create new session');
    }
  };

  // Send a message and get response
  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentSessionId) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Maximum 3 retries
      let retries = 0;
      let success = false;
      let response;
      
      while (retries < 3 && !success) {
        try {
          response = await chatApi.sendMessage(content, currentSessionId);
          success = true;
        } catch (err) {
          retries++;
          if (retries >= 3) throw err;
          // Wait before retrying
          await new Promise(r => setTimeout(r, 1000 * retries));
        }
      }
      
      if (response) {
        // Remove the context property from the bot message since it's not in the Message type
        const botMessage: Message = {
          id: crypto.randomUUID(),
          content: response.response,
          isUser: false,
          timestamp: new Date(),
          sentiment: response.sentiment
          // Removed context property to match Message type
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get a response');
      
      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
        sentiment: 'negative',
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: ConversationContextType = {
    currentSessionId,
    sessions,
    messages,
    isLoading,
    error,
    sendMessage,
    startNewSession,
    loadSession,
  };

  // Fix the Provider issue by explicitly using React.createElement
  return React.createElement(
    ConversationContext.Provider,
    { value: contextValue },
    children
  );
};

export const useConversation = (): ConversationContextType => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};