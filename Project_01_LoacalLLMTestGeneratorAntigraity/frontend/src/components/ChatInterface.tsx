import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
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
      requirement: 'Chat',
      content: '',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [activeTest, setActiveTest] = useState<TestCase | null>(history[0]);

  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const exportToPDF = (id?: string) => {
    if (!contentRef.current) return;
    const element = contentRef.current;
    
    const opt = {
      margin: 0.5,
      filename: `AI_TestCases_${id || activeTest?.id || 'export'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const exportToDocx = (id?: string) => {
    if (!contentRef.current) return;
    
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document</title><style>table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } th { background: #e0f2fe; color: #1e40af; } tr:nth-child(even) { background: #f8fafc; }</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + contentRef.current.innerHTML + footer;
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = url;
    fileDownload.download = `AI_TestCases_${id || activeTest?.id || 'export'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        // Show fetching text logic...
        setInput((prev) => prev ? prev + '\n\n[Reading file...]' : '[Reading file...]');

        const res = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (data.success) {
          setInput((prev) => prev.replace('[Reading file...]', '') + data.text);
        } else {
          setInput((prev) => prev.replace('[Reading file...]', ''));
          alert('Failed to parse file: ' + data.error);
        }
      } catch (err: any) {
        setInput((prev) => prev.replace('[Reading file...]', ''));
        alert('Upload Error: ' + err.message);
      }
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

    let currentTest = activeTest;
    
    if (!currentTest || input.trim().toLowerCase() === '/new') {
      currentTest = {
        id: Date.now().toString(),
        requirement: reqText,
        content: '',
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [currentTest!, ...prev]);
      setActiveTest(currentTest);
    }

    try {
      const payloadReq = currentTest.content 
        ? `Previous generated cases context:\n${currentTest.content}\n\nNew follow-up requirement: ${reqText}` 
        : reqText;

      const res = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement: payloadReq })
      });
      const data = await res.json();

      const newOutput = data.success ? data.content : `Error: ${data.error}`;
      const updatedTest: TestCase = {
        ...currentTest,
        content: currentTest.content 
          ? currentTest.content + `\n\n---\n### Follow-up Request: ${reqText}\n\n` + newOutput
          : newOutput
      };

      setHistory(prev => prev.map(t => t.id === currentTest!.id ? updatedTest : t));
      setActiveTest(updatedTest);
      
      if (data.success) {
        setTimeout(() => {
          const lowerReq = reqText.toLowerCase();
          if (lowerReq.includes('pdf')) {
            exportToPDF(currentTest!.id);
          } else if (lowerReq.includes('doc') || lowerReq.includes('word')) {
            exportToDocx(currentTest!.id);
          }
        }, 500);
      }
    } catch (err: any) {
      const errorTest = { ...currentTest, content: currentTest.content + `\n\nNetwork Error: ${err.message}` };
      setHistory(prev => prev.map(t => t.id === currentTest!.id ? errorTest : t));
      setActiveTest(errorTest);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="chat-interface">
      <aside className="chat-sidebar glass-panel">
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>History</h3>
          <button className="btn btn-secondary" onClick={() => setActiveTest(null)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>+ New</button>
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
          {isGenerating && !activeTest?.content ? (
            <div className="loading-state glass-panel animate-fade-in">
              <div className="spinner"></div>
              <p>Connecting to AI model and generating initial test cases...</p>
            </div>
          ) : activeTest ? (
            <div className="output-content animate-fade-in">
              <h3>Requirement: {activeTest.requirement}</h3>
              <div className="markdown-table-wrapper" ref={contentRef}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeTest.content}
                </ReactMarkdown>
              </div>
              
              {isGenerating && activeTest.content && (
                <div style={{ marginTop: '2rem', padding: '1rem', background: '#ffffff', borderRadius: '8px', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                  <div className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px' }}></div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Generating new test cases and updating...</span>
                </div>
              )}
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
            accept=".txt,.json,.md,.csv,.pdf,.docx"
          />
          <button
            type="button"
            className="btn attachment-btn"
            disabled={isGenerating}
            onClick={() => fileInputRef.current?.click()}
            title="Upload File context"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </button>
          <textarea
            className="req-input"
            placeholder="Ask here for test case generation..."
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
