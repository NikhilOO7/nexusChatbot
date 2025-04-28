import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { MainContent } from '../../components/MainContent/MainContent';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

export type SectionType = 'chat' | 'knowledge' | 'analytics' | 'settings';
// Define a general UUID type to handle the string format
type UUID = string;

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionType>('chat');
  // Change the state type to be more general
  const [sessionId, setSessionId] = useState<UUID>(() => crypto.randomUUID());

  useEffect(() => {
    // Initialize session or load existing session
    const initializeSession = () => {
      try {
        const lastSession = localStorage.getItem('lastChatSession');
        if (lastSession) {
          // Use the stored string as UUID
          setSessionId(lastSession as UUID);
        } else {
          const newSessionId = crypto.randomUUID();
          localStorage.setItem('lastChatSession', newSessionId);
          setSessionId(newSessionId);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        // If there's an error, just use the already created random UUID
      }
    };

    initializeSession();
  }, []);

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
        sessionId={sessionId}
      />
    </div>
  );
};