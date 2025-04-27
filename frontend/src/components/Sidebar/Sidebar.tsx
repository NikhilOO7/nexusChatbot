import { MessageSquare, FileText, BarChart2, Settings, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { SectionType } from '../../App';
import './Sidebar.css';

interface SidebarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-circle">AI</div>
      </div>
      
      <div className="sidebar-menu">
        <button 
          className={`sidebar-button ${activeSection === 'chat' ? 'active' : ''}`}
          onClick={() => onSectionChange('chat')}
          aria-label="Chat"
        >
          <MessageSquare size={24} />
          <span className="sidebar-label">Chat</span>
        </button>
        
        <button 
          className={`sidebar-button ${activeSection === 'knowledge' ? 'active' : ''}`}
          onClick={() => onSectionChange('knowledge')}
          aria-label="Knowledge Base"
        >
          <FileText size={24} />
          <span className="sidebar-label">Knowledge</span>
        </button>
        
        <button 
          className={`sidebar-button ${activeSection === 'analytics' ? 'active' : ''}`}
          onClick={() => onSectionChange('analytics')}
          aria-label="Analytics"
        >
          <BarChart2 size={24} />
          <span className="sidebar-label">Analytics</span>
        </button>
        
        <button 
          className={`sidebar-button ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => onSectionChange('settings')}
          aria-label="Settings"
        >
          <Settings size={24} />
          <span className="sidebar-label">Settings</span>
        </button>
      </div>
      
      <div className="sidebar-footer">
        <button 
          className="sidebar-button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          <span className="sidebar-label">Theme</span>
        </button>
        
        <button className="sidebar-button" aria-label="User profile">
          <User size={24} />
          <span className="sidebar-label">Profile</span>
        </button>
      </div>
    </div>
  );
};