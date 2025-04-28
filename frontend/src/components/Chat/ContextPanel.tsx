import { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw, Clock, X } from 'lucide-react';
import { chatApi } from '../../services/api';
import './Chat.css';

interface ContextPanelProps {
  sessionId: string;
  onClose?: () => void;
}

interface RelatedArticle {
  id: string;
  title: string;
  url: string;
  relevance: number;
}

interface ConversationSummary {
  topics: string[];
  sentiment: string;
  duration: string;
  messageCount: number;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ sessionId, onClose }) => {
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [conversationSummary, setConversationSummary] = useState<ConversationSummary | null>(null);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load related articles when session changes
  useEffect(() => {
    if (sessionId) {
      fetchRelatedArticles();
      fetchConversationSummary();
    }
  }, [sessionId]);

  const fetchRelatedArticles = async () => {
    setIsLoadingArticles(true);
    setError(null);
    
    try {
      const data = await chatApi.getRelatedArticles(sessionId);
      setRelatedArticles(data.articles || []);
    } catch (err) {
      console.error('Error fetching related articles:', err);
      setError('Failed to load related articles');
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const fetchConversationSummary = async () => {
    // Only fetch summary if the conversation has been going for a while
    if (!sessionId) return;
    
    setIsLoadingSummary(true);
    
    try {
      const data = await chatApi.summarizeConversation(sessionId);
      if (data.summary) {
        setConversationSummary({
          topics: data.summary.topics || [],
          sentiment: data.summary.sentiment || 'neutral',
          duration: data.summary.duration || 'ongoing',
          messageCount: data.summary.messageCount || 0
        });
      }
    } catch (err) {
      console.error('Error fetching conversation summary:', err);
      // Don't show an error for summary failures
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <div className="context-panel">
      {onClose && (
        <button 
          className="context-close mobile-only" 
          onClick={onClose}
          aria-label="Close context panel"
        >
          <X size={16} />
        </button>
      )}
      
      <div className="context-section">
        <div className="context-header-with-action">
          <h3 className="context-header">Conversation Details</h3>
        </div>
        
        <div className="context-box">
          <h4 className="context-subheader">Session Info</h4>
          <div className="context-item">
            <span className="context-label">Session ID:</span>
            <span className="context-value">{sessionId.substring(0, 8)}...</span>
          </div>
          {conversationSummary ? (
            <>
              <div className="context-item">
                <span className="context-label">Duration:</span>
                <span className="context-value">{conversationSummary.duration}</span>
              </div>
              <div className="context-item">
                <span className="context-label">Messages:</span>
                <span className="context-value">{conversationSummary.messageCount}</span>
              </div>
              <div className="context-item">
                <span className="context-label">Overall Tone:</span>
                <span className={`context-value sentiment-${conversationSummary.sentiment}`}>
                  {conversationSummary.sentiment}
                </span>
              </div>
            </>
          ) : (
            <div className="context-item">
              <span className="context-label">Status:</span>
              <span className="context-value">
                {isLoadingSummary ? 'Analyzing...' : 'Active'}
              </span>
            </div>
          )}
        </div>
        
        {conversationSummary && conversationSummary.topics.length > 0 && (
          <div className="topics-section">
            <h4 className="context-subheader">Key Topics</h4>
            <div className="topic-tags">
              {conversationSummary.topics.map((topic, index) => (
                <span key={index} className="topic-tag">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="context-section">
        <div className="context-header-with-action">
          <h4 className="context-subheader">Related Articles</h4>
          <button 
            className="context-action-button" 
            onClick={fetchRelatedArticles}
            disabled={isLoadingArticles}
            title="Refresh related articles"
          >
            <RefreshCw size={14} className={isLoadingArticles ? 'spin' : ''} />
          </button>
        </div>
        
        <div className="related-articles">
          {isLoadingArticles ? (
            <div className="loading-articles">
              <div className="loading-spinner small"></div>
              <span>Loading articles...</span>
            </div>
          ) : error ? (
            <div className="error-message small">{error}</div>
          ) : relatedArticles.length > 0 ? (
            relatedArticles.map(article => (
              <a 
                key={article.id} 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="article-link"
              >
                <span>{article.title}</span>
                <ExternalLink size={14} />
              </a>
            ))
          ) : (
            <div className="no-articles">
              No related articles found for this conversation yet.
            </div>
          )}
        </div>
      </div>
      
      <div className="context-section">
        <h4 className="context-subheader">Conversation Timeline</h4>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-icon">
              <Clock size={14} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">Conversation Started</div>
              <div className="timeline-time">Just now</div>
            </div>
          </div>
          {/* More timeline items would be added dynamically */}
        </div>
      </div>
    </div>
  );
};