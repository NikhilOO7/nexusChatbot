import { ExternalLink } from 'lucide-react';
import './Chat.css';

export const ContextPanel: React.FC = () => {
  return (
    <div className="context-panel">
      <div className="context-section">
        <h3 className="context-header">Conversation Details</h3>
        
        <div className="context-box">
          <h4 className="context-subheader">Session Info</h4>
          <div className="context-item">
            <span className="context-label">Session ID:</span>
            <span className="context-value">a782f5c3-8d</span>
          </div>
          <div className="context-item">
            <span className="context-label">Duration:</span>
            <span className="context-value">5m 12s</span>
          </div>
          <div className="context-item">
            <span className="context-label">User Type:</span>
            <span className="context-value">Registered</span>
          </div>
        </div>
      </div>
      
      <div className="context-section">
        <h4 className="context-subheader">Related Articles</h4>
        <div className="related-articles">
          <a href="#" className="article-link">
            <span>How to update your mobile app</span>
            <ExternalLink size={14} />
          </a>
          <a href="#" className="article-link">
            <span>Common authentication issues</span>
            <ExternalLink size={14} />
          </a>
          <a href="#" className="article-link">
            <span>Troubleshooting connection problems</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
      
      <div className="context-section">
        <h4 className="context-subheader">Current User</h4>
        <div className="user-info">
          <div className="user-avatar">JD</div>
          <div className="user-details">
            <div className="user-name">John Doe</div>
            <div className="user-since">Customer since Mar 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
};