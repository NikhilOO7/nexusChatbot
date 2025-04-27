import { Sidebar } from './components/Sidebar/Sidebar';
import { MainContent } from './components/MainContent/MainContent';
import { ThemeProvider } from './contexts/ThemeContext';
import { useState } from 'react';
import './App.css';

// Section types
export type SectionType = 'chat' | 'knowledge' | 'analytics' | 'settings';

function App() {
  const [activeSection, setActiveSection] = useState<SectionType>('chat');

  return (
    <ThemeProvider>
      <div className="app">
        <main>
          <div className="layout">
            <Sidebar 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />
            <MainContent activeSection={activeSection} />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;