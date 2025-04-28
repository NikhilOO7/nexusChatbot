import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send } from 'lucide-react';
import { Message } from '../../types/chat';
import { MessageItem } from './MessageItem';
import { SuggestedResponses } from './SuggestedResponses';
import { TypingIndicator } from './TypingIndicator';
import { ContextPanel } from './ContextPanel';
import { useAuth } from '../../contexts/AuthContext';
import './Chat.css';

interface ChatProps {
  sessionId: string;
}

export const Chat: React.FC<ChatProps> = ({ sessionId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello${user ? ' ' + user.name : ''}! I'm your AI customer support assistant. How can I help you today?`,
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

  // Load conversation history
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return; // Not authenticated

        const response = await fetch(`http://localhost:3000/api/chat/history/${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            // Convert date strings to Date objects
            const formattedMessages = data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, [sessionId]);

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
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: input,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        sentiment: data.sentiment,
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
      
      <ContextPanel sessionId={sessionId} />
    </div>
  );
};