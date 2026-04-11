import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Job } from '../types';

interface JobTrackerDB extends DBSchema {
  jobs: {
    key: string;
    value: Job;
    indexes: { 'by-date': number };
  };
}

let dbPromise: Promise<IDBPDatabase<JobTrackerDB>> | null = null;

export async function initDB() {
  if (!dbPromise) {
    dbPromise = openDB<JobTrackerDB>('JobTrackerDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('jobs')) {
          const store = db.createObjectStore('jobs', { keyPath: 'id' });
          store.createIndex('by-date', 'dateApplied');
        }
      },
    });
  }
  return dbPromise;
}

export async function getJobs(): Promise<Job[]> {
  const db = await initDB();
  return db.getAll('jobs');
}

export async function addJob(job: Job): Promise<void> {
  const db = await initDB();
  await db.put('jobs', job);
}

export async function updateJob(job: Job): Promise<void> {
  const db = await initDB();
  await db.put('jobs', job);
}

export async function deleteJob(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('jobs', id);
}

export async function clearAllJobs(): Promise<void> {
  const db = await initDB();
  await db.clear('jobs');
}
