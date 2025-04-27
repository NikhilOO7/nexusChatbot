import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send } from 'lucide-react';
import { Message } from '../../types/chat';
import { MessageItem } from './MessageItem';
import { SuggestedResponses } from './SuggestedResponses';
import { TypingIndicator } from './TypingIndicator';
import { ContextPanel } from './ContextPanel';
import './Chat.css';

interface ChatProps {
  sessionId: string;
}

export const Chat: React.FC<ChatProps> = ({ sessionId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI customer support assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
      sentiment: 'positive'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // In a real app, we would call the API here
      // For now, let's simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responseContent = getSimulatedResponse(input);
      
      const botMessage: Message = {
        id: crypto.randomUUID(),
        content: responseContent,
        isUser: false,
        timestamp: new Date(),
        sentiment: 'positive',
      };

      setMessages(prev => [...prev, botMessage]);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
        sentiment: 'negative',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedResponse = (response: string) => {
    setInput(response);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages-container">
        <div className="messages">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          
          {isLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
        
        {showSuggestions && messages.length > 0 && !isLoading && (
          <SuggestedResponses onSelect={handleSuggestedResponse} />
        )}
        
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="message-input"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="send-button"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
      
      <ContextPanel />
    </div>
  );
};

// Helper function to simulate responses (will be replaced with actual API call)
function getSimulatedResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return "Hello! How can I help you today?";
  }
  
  if (lowerInput.includes('account')) {
    return "I can help with account-related questions. What specific information do you need about your account?";
  }
  
  if (lowerInput.includes('password')) {
    return "To reset your password, please:\n\n1. Go to the login page\n2. Click 'Forgot Password'\n3. Enter your email address\n4. Follow the instructions sent to your email";
  }
  
  if (lowerInput.includes('billing')) {
    return "For billing inquiries, I can help explain charges, update payment methods, or assist with subscription changes. What specific billing question do you have?";
  }
  
  return "I understand your question. Let me search our knowledge base for the most relevant information to help you.";
}