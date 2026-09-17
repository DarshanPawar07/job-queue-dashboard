import { Inbox, Plus } from 'lucide-react';

interface EmptyStateProps {
  filtered: boolean;
  onCreateJob?: () => void;
}

export default function EmptyState({
  filtered,
  onCreateJob,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Inbox size={25} strokeWidth={1.8} />
      </div>

      <h3 className="mt-5 font-['Manrope'] text-lg font-extrabold text-slate-900">
        {filtered ? 'No matching jobs' : 'Your queue is empty'}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {filtered
          ? 'There are no jobs with the selected status. Try another filter.'
          : 'Create your first job to start managing your queue.'}
      </p>

      {!filtered && onCreateJob && (
        <button
          onClick={onCreateJob}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98]"
        >
          <Plus size={17} />
          Create your first job
        </button>
      )}
    </div>
  );
}