import {
  Check,
  CircleX,
  Play,
  Trash2,
} from 'lucide-react';

import type { Job, JobStatus } from '../types/job';
import { getNextStatuses } from '../utils/status';
import StatusBadge from './StatusBadge';

interface JobRowProps {
  job: Job;
  onStatusChange: (
    id: number,
    status: JobStatus,
  ) => void;
  onDelete: (id: number) => void;
  updatingId: number | null;
  deletingId: number | null;
}

const statusIcons = {
  running: Play,
  completed: Check,
  failed: CircleX,
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export default function JobRow({
  job,
  onStatusChange,
  onDelete,
  updatingId,
  deletingId,
}: JobRowProps) {
  const nextStatuses = getNextStatuses(job.status);

  const isUpdating = updatingId === job.id;
  const isDeleting = deletingId === job.id;

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="block px-4 py-4 md:hidden">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* Top */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">
                {job.title}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Job #{job.id}
              </p>
            </div>

            <StatusBadge status={job.status} />
          </div>

          {/* Details */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Type
              </p>

              <p className="mt-1 truncate text-xs font-semibold capitalize text-slate-700">
                {job.type}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Created
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                {formatDate(job.createdAt)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {nextStatuses.map((status) => {
              const Icon = statusIcons[status];

              return (
                <button
                  key={status}
                  disabled={isUpdating || isDeleting}
                  onClick={() =>
                    onStatusChange(job.id, status)
                  }
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdating ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                  ) : (
                    <Icon size={14} />
                  )}

                  {status === 'running'
                    ? 'Run'
                    : status === 'completed'
                      ? 'Complete'
                      : 'Fail'}
                </button>
              );
            })}

            <button
              disabled={isUpdating || isDeleting}
              onClick={() => onDelete(job.id)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
              title="Delete job"
              aria-label="Delete job"
            >
              {isDeleting ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-rose-600" />
              ) : (
                <Trash2 size={15} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden grid-cols-[minmax(200px,1.5fr)_110px_135px_180px_minmax(270px,1fr)] gap-4 px-5 py-4 transition hover:bg-slate-50/80 md:grid md:items-center">
        {/* Job */}
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-800">
            {job.title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Job #{job.id}
          </p>
        </div>

        {/* Type */}
        <div>
          <span className="inline-flex max-w-full truncate rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
            {job.type}
          </span>
        </div>

        {/* Status */}
        <div>
          <StatusBadge status={job.status} />
        </div>

        {/* Created */}
        <div className="text-sm text-slate-500">
          {formatDate(job.createdAt)}
        </div>

        {/* Actions */}
        <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
          {nextStatuses.map((status) => {
            const Icon = statusIcons[status];

            return (
              <button
                key={status}
                disabled={isUpdating || isDeleting}
                onClick={() =>
                  onStatusChange(job.id, status)
                }
                title={`Mark as ${status}`}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                ) : (
                  <Icon size={14} />
                )}

                <span>
                  {status === 'running'
                    ? 'Run'
                    : status === 'completed'
                      ? 'Complete'
                      : 'Fail'}
                </span>
              </button>
            );
          })}

          <button
            disabled={isUpdating || isDeleting}
            onClick={() => onDelete(job.id)}
            title="Delete job"
            className="ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-rose-600" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}