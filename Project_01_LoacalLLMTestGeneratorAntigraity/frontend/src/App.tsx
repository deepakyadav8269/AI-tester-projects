import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState<'chat' | 'settings'>('chat');

  return (
    <div className="app-container">
      <header className="app-header glass-panel">
        <div className="logo-section">
          <h1>AI Tester</h1>
          <span className="badge">Local LLM Generator</span>
        </div>
        <nav className="nav-actions">
          <button 
            className={`nav-btn ${activeView === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveView('chat')}
          >
            Generator
          </button>
          <button 
            className={`nav-btn ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveView('settings')}
          >
            Settings
          </button>
        </nav>
      </header>

      <main className="app-main animate-fade-in">
        {activeView === 'chat' ? <ChatInterface /> : <SettingsPanel />}
      </main>
    </div>
  );
}

export default App;
