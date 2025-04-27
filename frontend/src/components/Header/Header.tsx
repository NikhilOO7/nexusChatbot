import { List, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="header">
      <h1>{title}</h1>
      <div className="header-actions">
        <button className="icon-button" aria-label="Menu">
          <List size={20} />
        </button>
        <button className="primary-button">
          <Plus size={16} />
          <span>New Conversation</span>
        </button>
      </div>
    </header>
  );
};