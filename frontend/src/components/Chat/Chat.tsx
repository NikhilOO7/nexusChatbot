import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { SuggestedResponses } from './SuggestedResponses';
import { TypingIndicator } from './TypingIndicator';
import { ContextPanel } from './ContextPanel';
import { useConversation } from '../../contexts/ConversationContext';
import './Chat.css';

export const Chat: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    error,
    sendMessage,
    startNewSession,
    currentSessionId
  } = useConversation();
  
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showContextPanel, setShowContextPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage(input);
    setInput('');
    setShowSuggestions(false);
    
    // Show suggestions after bot response
    setTimeout(() => {
      setShowSuggestions(true);
    }, 500);
  };

  const handleSuggestedResponse = (response: string) => {
    setInput(response);
  };

  const handleNewConversation = () => {
    startNewSession();
  };

  const toggleContextPanel = () => {
    setShowContextPanel(!showContextPanel);
  };

  return (
    <div className={`chat-container ${showContextPanel ? 'show-context-panel' : ''}`}>
      <div className="chat-header">
        <button
          className="new-chat-button"
          onClick={handleNewConversation}
          title="Start New Conversation"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </button>
        <div className="session-info">
          <span>Session: {currentSessionId.substring(0, 8)}...</span>
        </div>
        <button 
          className="context-toggle mobile-only"
          onClick={toggleContextPanel}
          aria-label={showContextPanel ? 'Hide context panel' : 'Show context panel'}
        >
          {showContextPanel ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="chat-messages-container">
        <div className="messages">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          
          {isLoading && <TypingIndicator />}
          
          {error && <div className="error-message">{error}</div>}
          
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
      
      <ContextPanel sessionId={currentSessionId} onClose={() => setShowContextPanel(false)} />
    </div>
  );
};