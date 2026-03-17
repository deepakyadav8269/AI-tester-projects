import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatInterface.css';

interface TestCase {
  id: string;
  requirement: string;
  content: string;
  timestamp: string;
}

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TestCase[]>([
    {
      id: '1',
      requirement: 'User Login feature',
      content: 'Sample functional and non-functional test cases for login...',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [activeTest, setActiveTest] = useState<TestCase | null>(history[0]);

  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        setInput((prev) => prev ? prev + '\n\n' + text : text);
      };
      reader.readAsText(file);
    }
    if (e.target) {
      e.target.value = ''; // Reset input to allow re-upload
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    
    const reqText = input;
    setInput('');
    setIsGenerating(true);

    const newTest: TestCase = {
      id: Date.now().toString(),
      requirement: reqText,
      content: '', // Start empty since loader handles UI
      timestamp: new Date().toLocaleTimeString()
    };
    
    setHistory(prev => [newTest, ...prev]);
    setActiveTest(newTest);

    try {
      const res = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement: reqText })
      });
      const data = await res.json();
      
      const updatedTest: TestCase = {
        ...newTest,
        content: data.success ? data.content : `Error: ${data.error}`
      };
      
      setHistory(prev => prev.map(t => t.id === newTest.id ? updatedTest : t));
      setActiveTest(updatedTest);
    } catch (err: any) {
      const errorTest = { ...newTest, content: `Network Error: ${err.message}` };
      setHistory(prev => prev.map(t => t.id === newTest.id ? errorTest : t));
      setActiveTest(errorTest);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="chat-interface">
      <aside className="chat-sidebar glass-panel">
        <div className="sidebar-header">
          <h3>History</h3>
        </div>
        <div className="history-list">
          {history.map(item => (
            <div 
              key={item.id} 
              className={`history-item ${activeTest?.id === item.id ? 'active' : ''}`}
              onClick={() => setActiveTest(item)}
            >
              <span className="history-title">{item.requirement}</span>
              <span className="history-time">{item.timestamp}</span>
            </div>
          ))}
        </div>
      </aside>

      <div className="chat-main glass-panel">
        <div className="test-case-output">
          {isGenerating ? (
            <div className="loading-state glass-panel animate-fade-in">
              <div className="spinner"></div>
              <p>Connecting to AI model and generating test cases...</p>
            </div>
          ) : activeTest ? (
            <div className="output-content animate-fade-in">
              <h3>Requirement: {activeTest.requirement}</h3>
              <div className="markdown-table-wrapper">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeTest.content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>Enter a Jira requirement below to generate test cases.</p>
            </div>
          )}
        </div>

        <form className="chat-input-area border-t glass-panel" onSubmit={handleGenerate}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
            accept=".txt,.json,.md,.csv" 
          />
          <button 
            type="button" 
            className="btn attachment-btn" 
            disabled={isGenerating}
            onClick={() => fileInputRef.current?.click()}
            title="Upload File context"
          >
            📎
          </button>
          <textarea 
            className="req-input"
            placeholder="Ask here is here TC for Requirement..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate(e);
              }
            }}
            rows={1}
          />
          <button type="submit" className="btn generate-btn" disabled={isGenerating}>
            {isGenerating ? (
               <span style={{ animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>↻</span>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
