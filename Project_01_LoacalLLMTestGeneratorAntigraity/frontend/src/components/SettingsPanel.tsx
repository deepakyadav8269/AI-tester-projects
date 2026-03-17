import React, { useState } from 'react';
import './SettingsPanel.css';

const SettingsPanel: React.FC = () => {
  const [modelSettings, setModelSettings] = useState({
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama3.2',
    grokKey: '',
    openAiKey: '',
    claudeKey: '',
    geminiKey: '',
    lmStudioUrl: 'http://localhost:1234/v1',
    activeProvider: 'ollama'
  });

  const [testStatus, setTestStatus] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setModelSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setTestStatus({ msg: 'Saving config...', type: 'info' });
      const res = await fetch('http://localhost:3001/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelSettings)
      });
      const data = await res.json();
      if(data.success) {
        setTestStatus({ msg: 'Settings saved successfully!', type: 'success' });
      } else {
        setTestStatus({ msg: 'Failed to save', type: 'error' });
      }
    } catch (e: any) {
      setTestStatus({ msg: `Error: ${e.message}`, type: 'error' });
    }
  };

  const handleTestConnection = async () => {
    setTestStatus({ msg: 'Testing connection...', type: 'info' });
    try {
      const res = await fetch('http://localhost:3001/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelSettings)
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus({ msg: data.message, type: 'success' });
      } else {
        setTestStatus({ msg: data.message, type: 'error' });
      }
    } catch (err: any) {
      setTestStatus({ msg: `Connection failed: ${err.message}`, type: 'error' });
    }
  };

  return (
    <div className="settings-panel glass-panel animate-fade-in">
      <div className="settings-header">
        <h2>LLM Provider Configuration</h2>
        <p>Configure your local or cloud LLM APIs here.</p>
      </div>

      <div className="settings-content">
        <div className="setting-group">
          <label>Active Provider</label>
          <select 
            name="activeProvider" 
            value={modelSettings.activeProvider} 
            onChange={handleChange}
            className="styled-input"
          >
            <option value="ollama">Ollama (Local)</option>
            <option value="lmstudio">LM Studio (Local)</option>
            <option value="openai">OpenAI</option>
            <option value="claude">Anthropic Claude</option>
            <option value="gemini">Google Gemini</option>
            <option value="grok">xAI Grok</option>
          </select>
        </div>

        <div className="provider-card">
          <h3>Ollama Settings</h3>
          <div className="setting-group">
            <label>API URL</label>
            <input 
              type="text" 
              name="ollamaUrl" 
              value={modelSettings.ollamaUrl} 
              onChange={handleChange} 
              className="styled-input"
            />
          </div>
          <div className="setting-group">
            <label>Model Name</label>
            <input 
              type="text" 
              name="ollamaModel" 
              value={modelSettings.ollamaModel} 
              onChange={handleChange} 
              className="styled-input"
            />
          </div>
        </div>

        <div className="provider-card">
          <h3>LM Studio Settings</h3>
          <div className="setting-group">
            <label>API Base URL</label>
            <input 
              type="text" 
              name="lmStudioUrl" 
              value={modelSettings.lmStudioUrl} 
              onChange={handleChange} 
              className="styled-input"
            />
          </div>
        </div>

        <div className="provider-card">
          <h3>Cloud API Keys</h3>
          <div className="setting-group">
            <label>OpenAI API Key</label>
            <input 
              type="password" 
              name="openAiKey" 
              value={modelSettings.openAiKey} 
              onChange={handleChange} 
              placeholder="sk-..."
              className="styled-input"
            />
          </div>
          <div className="setting-group">
            <label>Grok API Key</label>
            <input 
              type="password" 
              name="grokKey" 
              value={modelSettings.grokKey} 
              onChange={handleChange} 
              placeholder="xai-..."
              className="styled-input"
            />
          </div>
          <div className="setting-group">
            <label>Claude API Key</label>
            <input 
              type="password" 
              name="claudeKey" 
              value={modelSettings.claudeKey} 
              onChange={handleChange} 
              placeholder="sk-ant-..."
              className="styled-input"
            />
          </div>
          <div className="setting-group">
            <label>Gemini API Key</label>
            <input 
              type="password" 
              name="geminiKey" 
              value={modelSettings.geminiKey} 
              onChange={handleChange} 
              className="styled-input"
            />
          </div>
        </div>
      </div>

      <div className="settings-footer">
        {testStatus && (
          <div className={`status-msg animate-fade-in ${testStatus.type}`}>
            {testStatus.msg}
          </div>
        )}
        <div className="footer-actions">
          <button className="btn btn-secondary" onClick={handleTestConnection}>
            Test Connection
          </button>
          <button className="btn" onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
