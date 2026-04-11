export type JobStatus = 'Wishlist' | 'Applied' | 'Follow-up' | 'Interview' | 'Offer' | 'Rejected';

export interface Job {
  id: string;
  companyName: string;
  role: string;
  linkedinUrl?: string;
  resumeUsed?: string;
  dateApplied: number;
  salaryRange?: string;
  notes?: string;
  status: JobStatus;
}
