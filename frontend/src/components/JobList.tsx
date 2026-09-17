import type { Job, JobStatus } from '../types/job';
import EmptyState from './EmptyState';
import JobRow from './JobRow';

interface JobListProps {
  jobs: Job[];
  filtered: boolean;
  onCreateJob: () => void;
  onStatusChange: (
    id: number,
    status: JobStatus,
  ) => void;
  onDelete: (id: number) => void;
  updatingId: number | null;
  deletingId: number | null;
}

export default function JobList({
  jobs,
  filtered,
  onCreateJob,
  onStatusChange,
  onDelete,
  updatingId,
  deletingId,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        filtered={filtered}
        onCreateJob={onCreateJob}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Desktop table header */}
      <div className="hidden border-y border-slate-100 bg-slate-50/70 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 md:grid md:grid-cols-[minmax(200px,1.5fr)_110px_135px_180px_minmax(270px,1fr)] md:items-center md:gap-4">
        <span>Job</span>
        <span>Type</span>
        <span>Status</span>
        <span>Created</span>
        <span>Actions</span>
      </div>

      {/* Jobs */}
      <div className="divide-y divide-slate-100 md:divide-y">
        {jobs.map((job) => (
          <JobRow
            key={job.id}
            job={job}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            updatingId={updatingId}
            deletingId={deletingId}
          />
        ))}
      </div>
    </div>
  );
}