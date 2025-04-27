import { useState } from 'react';
import { Chat } from '../Chat/Chat';
import { Knowledge } from '../Knowledge/Knowledge';
import { Analytics } from '../Analytics/Analytics';
import { Settings } from '../Settings/Settings';
import { Header } from '../Header/Header';
import { SectionType } from '../../App';
import './MainContent.css';

interface MainContentProps {
  activeSection: SectionType;
}

export const MainContent: React.FC<MainContentProps> = ({ activeSection }) => {
  const [sessionId] = useState(() => crypto.randomUUID());
  
  return (
    <div className="main-content">
      <Header title={getSectionTitle(activeSection)} />
      <div className="content-container">
        {activeSection === 'chat' && <Chat sessionId={sessionId} />}
        {activeSection === 'knowledge' && <Knowledge />}
        {activeSection === 'analytics' && <Analytics />}
        {activeSection === 'settings' && <Settings />}
      </div>
    </div>
  );
};

function getSectionTitle(section: SectionType): string {
  switch (section) {
    case 'chat':
      return 'Chat Support';
    case 'knowledge':
      return 'Knowledge Base';
    case 'analytics':
      return 'Analytics Dashboard';
    case 'settings':
      return 'Settings';
    default:
      return 'Customer Support';
  }
}