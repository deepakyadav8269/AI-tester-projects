import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Job } from '../types';
import { ExternalLink, Edit2, Trash2, Clock, Briefcase } from 'lucide-react';

export function JobCard({ job, onEdit, onDelete, isOverlay = false }: {
  job: Job,
  onEdit: (j: Job) => void,
  onDelete: (id: string) => void,
  isOverlay?: boolean
}) {
  const daysAgo = Math.floor((Date.now() - job.dateApplied) / (1000 * 60 * 60 * 24));
  
  const statusColors: any = {
    'Wishlist': 'border-l-gray-400',
    'Applied': 'border-l-blue-400',
    'Follow-up': 'border-l-yellow-400',
    'Interview': 'border-l-purple-400',
    'Offer': 'border-l-green-400',
    'Rejected': 'border-l-red-400',
  };

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 ${statusColors[job.status]} group relative hover:shadow-md transition-shadow ${isOverlay ? 'rotate-2 scale-105 shadow-xl' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1 pr-6" title={job.role}>{job.role}</h4>
        {job.linkedinUrl && (
          <a href={job.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30" onPointerDown={(e) => e.stopPropagation()}>
            <ExternalLink size={16} />
          </a>
        )}
      </div>
      
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">{job.companyName}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {job.resumeUsed && (
          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
            <Briefcase size={12} />
            {job.resumeUsed}
          </span>
        )}
        {job.salaryRange && (
          <span className="inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
            💰 {job.salaryRange}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
        <Clock size={12} />
        {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 shadow-sm overflow-hidden" onPointerDown={(e) => e.stopPropagation()}>
        <button onClick={() => onEdit(job)} className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 border-r border-gray-200 dark:border-gray-600"><Edit2 size={14} /></button>
        <button onClick={() => onDelete(job.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

export function JobCardSortable(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.job.id, data: { status: props.job.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <JobCard {...props} />
    </div>
  );
}
