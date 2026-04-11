import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Job, JobStatus } from '../types';
import { JobCardSortable } from './JobCard';

export function Column({ status, jobs, onEdit, onDelete }: { 
  status: JobStatus, 
  jobs: Job[], 
  onEdit: (j: Job) => void, 
  onDelete: (id: string) => void 
}) {
  const { setNodeRef } = useDroppable({ id: status });

  // Status Colors
  const colors: any = {
    'Wishlist': 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
    'Applied': 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    'Follow-up': 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    'Interview': 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    'Offer': 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    'Rejected': 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  };

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col flex-shrink-0 w-80 max-h-full rounded-xl border-t-4 ${colors[status]} shadow-sm overflow-hidden`}
    >
      <div className="p-4 font-semibold text-gray-700 dark:text-gray-200 flex justify-between items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700">
        <h3 className="tracking-wide text-sm uppercase">{status}</h3>
        <span className="bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs shadow-sm text-gray-500 dark:text-gray-300">{jobs.length}</span>
      </div>
      
      <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px]">
        <SortableContext items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map(job => (
            <JobCardSortable key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
