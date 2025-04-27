import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import './Chat.css';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(uuidv4());

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
      id: uuidv4(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input,
          sessionId,
        }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: uuidv4(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        sentiment: data.sentiment,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: uuidv4(),
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

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isUser ? 'user' : 'bot'} ${message.sentiment || ''}`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
            <span className="timestamp">
              {message.timestamp.toLocaleTimeString()}
              {!message.isUser && message.sentiment && (
                <span className={`sentiment-indicator ${message.sentiment}`}>
                  {message.sentiment}
                </span>
              )}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};