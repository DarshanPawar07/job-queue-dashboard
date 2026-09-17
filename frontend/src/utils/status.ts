import type { JobStatus } from '../types/job';

export const statusConfig: Record<
  JobStatus,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  pending: {
    label: 'Pending',
    className:
      'bg-amber-50 text-amber-700 border-amber-200',
    dotClassName: 'bg-amber-500',
  },

  running: {
    label: 'Running',
    className:
      'bg-blue-50 text-blue-700 border-blue-200',
    dotClassName: 'bg-blue-500',
  },

  completed: {
    label: 'Completed',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClassName: 'bg-emerald-500',
  },

  failed: {
    label: 'Failed',
    className:
      'bg-rose-50 text-rose-700 border-rose-200',
    dotClassName: 'bg-rose-500',
  },
};

export const getNextStatuses = (
  status: JobStatus,
): JobStatus[] => {
  switch (status) {
    case 'pending':
      return ['running'];

    case 'running':
      return ['completed', 'failed'];

    case 'completed':
    case 'failed':
      return [];

    default:
      return [];
  }
};