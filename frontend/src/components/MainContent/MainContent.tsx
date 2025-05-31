import { Chat } from '../Chat/Chat';
import { Knowledge } from '../Knowledge/Knowledge';
import { Analytics } from '../Analytics/Analytics';
import { Settings } from '../Settings/Settings';
import { Header } from '../Header/Header';
import { SectionType } from '../../pages/Dashboard/Dashboard';
import './MainContent.css';

interface MainContentProps {
  activeSection: SectionType;
  // sessionId: string; // Removed as it's no longer used
}

export const MainContent: React.FC<MainContentProps> = ({ 
  activeSection
  // sessionId // Removed
}) => {
  return (
    <div className="main-content">
      <Header title={getSectionTitle(activeSection)} />
      <div className="content-container">
        {activeSection === 'chat' && <Chat />}
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