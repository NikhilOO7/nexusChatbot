import { Sliders, Save, Database, Key } from 'lucide-react';
import { useState } from 'react';
import './Settings.css';

export const Settings: React.FC = () => {
  const [temperature, setTemperature] = useState(0.7);
  const [contextLength, setContextLength] = useState(5);
  const [searchResults, setSearchResults] = useState(3);
  
  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-card">
          <div className="settings-header">
            <h2 className="settings-title">AI Model Settings</h2>
            <Sliders size={20} className="settings-icon" />
          </div>
          
          <div className="settings-body">
            <div className="setting-group">
              <label className="setting-label">Model</label>
              <select className="setting-select">
                <option>GPT-4</option>
                <option>GPT-3.5-Turbo</option>
                <option>Claude 3 Opus</option>
                <option>Claude 3 Sonnet</option>
              </select>
              <p className="setting-help">Select the AI model to use for generating responses.</p>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">Temperature: {temperature}</label>
              <div className="slider-container">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={temperature} 
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="setting-slider" 
                />
                <div className="slider-labels">
                  <span>More Precise (0)</span>
                  <span>More Creative (1)</span>
                </div>
              </div>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">Context Length</label>
              <div className="number-input-container">
                <input 
                  type="number" 
                  value={contextLength} 
                  onChange={(e) => setContextLength(parseInt(e.target.value))}
                  min="1" 
                  max="20" 
                  className="setting-number" 
                />
                <span className="number-unit">messages</span>
              </div>
              <p className="setting-help">Number of previous messages to include for context.</p>
            </div>
          </div>
        </div>
        
        <div className="settings-card">
          <div className="settings-header">
            <h2 className="settings-title">Knowledge Base Settings</h2>
            <Database size={20} className="settings-icon" />
          </div>
          
          <div className="settings-body">
            <div className="setting-group">
              <label className="setting-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Auto-update index when documents change</span>
              </label>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">Search Results</label>
              <div className="number-input-container">
                <input 
                  type="number" 
                  value={searchResults} 
                  onChange={(e) => setSearchResults(parseInt(e.target.value))}
                  min="1" 
                  max="10" 
                  className="setting-number" 
                />
                <span className="number-unit">documents</span>
              </div>
              <p className="setting-help">Number of documents to retrieve per query.</p>
            </div>
            
            <div className="setting-group">
              <button className="setting-button">
                Rebuild Search Index
              </button>
              <p className="setting-help">Last indexed: 2 hours ago</p>
            </div>
          </div>
        </div>
        
        <div className="settings-card">
          <div className="settings-header">
            <h2 className="settings-title">Integration Settings</h2>
            <Key size={20} className="settings-icon" />
          </div>
          
          <div className="settings-body">
            <div className="setting-group">
              <label className="setting-label">OpenAI API Key</label>
              <input 
                type="password" 
                value="sk-••••••••••••••••••••••" 
                readOnly
                className="setting-input" 
              />
              <button className="link-button">Change API Key</button>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">MongoDB Connection</label>
              <div className="connection-status">
                <div className="status-indicator connected"></div>
                <span className="status-text connected">Connected</span>
              </div>
              <button className="link-button">Test Connection</button>
            </div>
          </div>
        </div>
        
        <div className="settings-actions">
            <button className="save-button">
              <Save size={16} />
              <span>Save Settings</span>
            </button>
        </div>
      </div>
    </div>
  );
};