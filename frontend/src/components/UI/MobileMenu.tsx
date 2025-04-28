import React, { useState } from 'react';
import { Menu, X, MessageSquare, FileText, BarChart2, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SectionType } from '../../pages/Dashboard/Dashboard';
import './MobileMenu.css';

interface MobileMenuProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const handleSectionClick = (section: SectionType) => {
    onSectionChange(section);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="mobile-menu">
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)}>
          <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="mobile-logo">
                <span className="logo-icon">AI</span>
                <span className="logo-text">Support Bot</span>
              </div>
              <button 
                className="mobile-menu-close"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mobile-menu-items">
              <button 
                className={`mobile-menu-item ${activeSection === 'chat' ? 'active' : ''}`}
                onClick={() => handleSectionClick('chat')}
              >
                <MessageSquare size={20} />
                <span>Chat</span>
              </button>
              
              <button 
                className={`mobile-menu-item ${activeSection === 'knowledge' ? 'active' : ''}`}
                onClick={() => handleSectionClick('knowledge')}
              >
                <FileText size={20} />
                <span>Knowledge Base</span>
              </button>
              
              <button 
                className={`mobile-menu-item ${activeSection === 'analytics' ? 'active' : ''}`}
                onClick={() => handleSectionClick('analytics')}
              >
                <BarChart2 size={20} />
                <span>Analytics</span>
              </button>
              
              <button 
                className={`mobile-menu-item ${activeSection === 'settings' ? 'active' : ''}`}
                onClick={() => handleSectionClick('settings')}
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </div>
            
            <div className="mobile-menu-footer">
              <button className="mobile-menu-item">
                <User size={20} />
                <span>Profile</span>
              </button>
              
              <button 
                className="mobile-menu-item logout"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};