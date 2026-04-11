import React, { useRef } from 'react';
import { Plus, Search, Moon, Sun, Download, Upload } from 'lucide-react';
import { Job } from '../types';
import { clearAllJobs, addJob } from '../db/db';

export function Header({ darkMode, toggleDarkMode, onAddJob, searchQuery, setSearchQuery, jobs, setJobs }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'job-tracker-backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedJobs = JSON.parse(e.target?.result as string) as Job[];
        if (Array.isArray(importedJobs) && confirm(`Import ${importedJobs.length} jobs? This will replace your current data.`)) {
          await clearAllJobs();
          for (const job of importedJobs) {
            await addJob(job);
          }
          setJobs(importedJobs);
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    if(event.target) event.target.value = '';
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner">
            J
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            JobTracker AI
          </h1>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search companies, roles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 rounded-lg text-sm outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
            <button title="Import JSON" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
              <Upload size={18} />
            </button>
            <button title="Export JSON" onClick={exportData} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
              <Download size={18} />
            </button>
            <button title="Toggle Dark Mode" onClick={toggleDarkMode} className="p-2 text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400 bg-gray-100 dark:bg-gray-700/50 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={onAddJob} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-blue-500/30 ml-2">
              <Plus size={18} />
              <span className="hidden sm:inline">Add Job</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
