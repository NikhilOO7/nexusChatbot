import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { MainContent } from '../../components/MainContent/MainContent';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

export type SectionType = 'chat' | 'knowledge' | 'analytics' | 'settings';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionType>('chat');

  const handleSectionChange = (section: SectionType) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
        onLogout={handleLogout}
        user={user}
      />
      <MainContent 
        activeSection={activeSection} 
      />
    </div>
  );
};