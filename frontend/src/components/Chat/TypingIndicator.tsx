import './Chat.css';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="message bot loading">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};