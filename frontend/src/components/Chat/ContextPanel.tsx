import { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Chat.css';

interface ContextPanelProps {
  sessionId: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  url: string;
  relevance: number;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ sessionId }) => {
  const { user } = useAuth();
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRelatedArticles();
  }, [sessionId]);

  const fetchRelatedArticles = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:3000/api/knowledge/related/${sessionId}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setRelatedArticles(data.articles || []);
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="context-panel">
      <div className="context-section">
        <div className="context-header-with-action">
          <h3 className="context-header">Conversation Details</h3>
        </div>
        
        <div className="context-box">
          <h4 className="context-subheader">Session Info</h4>
          <div className="context-item">
            <span className="context-label">Session ID:</span>
            <span className="context-value">{sessionId.substring(0, 8)}</span>
          </div>
          <div className="context-item">
            <span className="context-label">Duration:</span>
            <span className="context-value">Active</span>
          </div>
          <div className="context-item">
            <span className="context-label">User Type:</span>
            <span className="context-value">{user ? 'Registered' : 'Guest'}</span>
          </div>
        </div>
      </div>
      
      <div className="context-section">
        <div className="context-header-with-action">
          <h4 className="context-subheader">Related Articles</h4>
          <button 
            className="context-action-button" 
            onClick={fetchRelatedArticles}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          </button>
        </div>
        
        <div className="related-articles">
          {relatedArticles.length > 0 ? (
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
      
      {user && (
        <div className="context-section">
          <h4 className="context-subheader">Current User</h4>
          <div className="user-info">
            <div className="user-avatar">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-since">{user.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};