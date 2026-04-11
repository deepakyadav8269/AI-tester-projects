import React, { useState, useEffect } from 'react';
import { X, Building, Briefcase, MapPin, DollarSign, StickyNote, Link as LinkIcon, FileText } from 'lucide-react';
import { Job, JobStatus } from '../types';

const STATUSES: JobStatus[] = ['Wishlist', 'Applied', 'Follow-up', 'Interview', 'Offer', 'Rejected'];

export function JobModal({ job, onClose, onSave, existingResumes }: {
  job: Job | null,
  onClose: () => void,
  onSave: (j: Partial<Job>) => void,
  existingResumes: string[]
}) {
  const [formData, setFormData] = useState<Partial<Job>>({
    companyName: '',
    role: '',
    linkedinUrl: '',
    resumeUsed: '',
    salaryRange: '',
    notes: '',
    status: 'Wishlist'
  });

  useEffect(() => {
    if (job) {
      setFormData(job);
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.role) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-gray-900/60 dark:bg-black/80 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Building className="text-blue-500" size={24} />
            {job ? 'Edit Job Application' : 'Add New Job'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">Company Name <span className="text-red-500">*</span></label>
              <input required autoFocus type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all" placeholder="e.g. Google" />
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">Role / Title <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all" placeholder="e.g. Senior Frontend Engineer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1 col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"><LinkIcon size={14}/> LinkedIn Job URL</label>
              <input type="url" value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all" placeholder="https://linkedin.com/jobs/view/..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as JobStatus})} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all appearance-none cursor-pointer">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"><DollarSign size={14}/> Salary Range</label>
              <input type="text" value={formData.salaryRange || ''} onChange={e => setFormData({...formData, salaryRange: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all" placeholder="e.g. $150K - $180K" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"><FileText size={14}/> Resume Used</label>
            <input type="text" list="resumes" value={formData.resumeUsed || ''} onChange={e => setFormData({...formData, resumeUsed: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all" placeholder="e.g. SDE_Resume_v3" />
            <datalist id="resumes">
              {existingResumes.map(r => <option key={r} value={r} />)}
            </datalist>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"><StickyNote size={14}/> Notes</label>
            <textarea rows={3} value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all resize-none" placeholder="Recruiter name, referrals, things to remember..." />
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95">
            {job ? 'Save Changes' : 'Create Job'}
          </button>
        </div>
      </div>
    </div>
  );
}
