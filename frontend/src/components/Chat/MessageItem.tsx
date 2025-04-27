import ReactMarkdown from 'react-markdown';
import { Message } from '../../types/chat';
import './Chat.css';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div className={`message ${message.isUser ? 'user' : 'bot'}`}>
      <div className="message-content">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
      <div className="message-footer">
        <span className="timestamp">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {!message.isUser && message.sentiment && (
          <span className={`sentiment-indicator ${message.sentiment}`}>
            {message.sentiment}
          </span>
        )}
      </div>
    </div>
  );
};