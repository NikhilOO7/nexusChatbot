import './Chat.css';

interface SuggestedResponsesProps {
  onSelect: (response: string) => void;
}

export const SuggestedResponses: React.FC<SuggestedResponsesProps> = ({ onSelect }) => {
  const suggestions = [
    "How do I reset my password?",
    "What are your business hours?",
    "I need help with my order",
    "Can I speak to a human agent?"
  ];

  return (
    <div className="suggested-responses">
      <div className="suggestions-container">
        {suggestions.map((suggestion, index) => (
          <button 
            key={index} 
            className="suggestion-button"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};