import React from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Job, JobStatus } from '../types';
import { Column } from './Column';
import { JobCard } from './JobCard';

const COLUMNS: JobStatus[] = ['Wishlist', 'Applied', 'Follow-up', 'Interview', 'Offer', 'Rejected'];

export function Board({ jobs, onEdit, onDelete, onStatusChange }: { 
  jobs: Job[], 
  onEdit: (j: Job) => void, 
  onDelete: (id: string) => void,
  onStatusChange: (id: string, s: JobStatus) => void 
}) {
  const [activeJob, setActiveJob] = React.useState<Job | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const job = jobs.find(j => j.id === event.active.id);
    if (job) setActiveJob(job);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveJob(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const overColumn = COLUMNS.includes(overId as JobStatus) 
      ? overId as JobStatus 
      : jobs.find(j => j.id === overId)?.status;

    if (overColumn && activeJob?.status !== overColumn) {
      onStatusChange(activeId, overColumn as JobStatus);
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full items-start pb-4">
        {COLUMNS.map(col => (
          <Column 
            key={col} 
            status={col} 
            jobs={jobs.filter(j => j.status === col).sort((a,b) => b.dateApplied - a.dateApplied)} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeJob ? <JobCard job={activeJob} onEdit={() => {}} onDelete={() => {}} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
