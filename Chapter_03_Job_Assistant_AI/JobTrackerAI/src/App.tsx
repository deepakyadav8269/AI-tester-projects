import React, { useEffect, useState, useMemo } from 'react';
import { Board } from './components/Board';
import { Header } from './components/Header';
import { JobModal } from './components/JobModal';
import { getJobs, updateJob, deleteJob, addJob } from './db/db';
import { Job } from './types';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    loadJobs();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const loadJobs = async () => {
    const loadedJobs = await getJobs();
    setJobs(loadedJobs);
  };

  const handleSaveJob = async (jobData: Partial<Job>) => {
    if (editingJob) {
      const updated = { ...editingJob, ...jobData } as Job;
      await updateJob(updated);
      setJobs(jobs.map(j => j.id === updated.id ? updated : j));
    } else {
      const newJob: Job = {
        id: crypto.randomUUID(),
        dateApplied: Date.now(),
        status: 'Wishlist',
        ...jobData
      } as Job;
      await addJob(newJob);
      setJobs([...jobs, newJob]);
    }
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      await deleteJob(id);
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  const updateJobStatus = async (id: string, newStatus: any) => {
    const job = jobs.find(j => j.id === id);
    if (job && job.status !== newStatus) {
      const updated = { ...job, status: newStatus };
      await updateJob(updated);
      setJobs(jobs.map(j => j.id === id ? updated : j));
    }
  };

  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;
    const lower = searchQuery.toLowerCase();
    return jobs.filter(j => 
      j.companyName.toLowerCase().includes(lower) || 
      j.role.toLowerCase().includes(lower)
    );
  }, [jobs, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col font-[Inter,sans-serif] bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onAddJob={() => { setEditingJob(null); setIsModalOpen(true); }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        jobs={jobs}
        setJobs={setJobs}
      />
      
      <main className="flex-1 overflow-x-auto p-6 bg-gray-50 dark:bg-gray-900">
        <Board 
          jobs={filteredJobs} 
          onEdit={(job) => { setEditingJob(job); setIsModalOpen(true); }}
          onDelete={handleDeleteJob}
          onStatusChange={updateJobStatus}
        />
      </main>

      {isModalOpen && (
        <JobModal 
          job={editingJob} 
          onClose={() => { setIsModalOpen(false); setEditingJob(null); }}
          onSave={handleSaveJob}
          existingResumes={Array.from(new Set(jobs.map(j => j.resumeUsed).filter(Boolean))) as string[]}
        />
      )}
    </div>
  );
}
