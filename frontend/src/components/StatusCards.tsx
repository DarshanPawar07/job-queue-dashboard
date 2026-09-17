import {
  CheckCircle2,
  CircleDot,
  Clock3,
  ListChecks,
  PlayCircle,
  XCircle,
} from 'lucide-react';
import type { Job } from '../types/job';

interface StatusCardsProps {
  jobs: Job[];
}

export default function StatusCards({
  jobs,
}: StatusCardsProps) {
  const counts = {
    total: jobs.length,
    pending: jobs.filter((job) => job.status === 'pending').length,
    running: jobs.filter((job) => job.status === 'running').length,
    completed: jobs.filter(
      (job) => job.status === 'completed',
    ).length,
    failed: jobs.filter((job) => job.status === 'failed').length,
  };

  const cards = [
    {
      label: 'Total Jobs',
      value: counts.total,
      icon: ListChecks,
      iconClass: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Pending',
      value: counts.pending,
      icon: Clock3,
      iconClass: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Running',
      value: counts.running,
      icon: PlayCircle,
      iconClass: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Completed',
      value: counts.completed,
      icon: CheckCircle2,
      iconClass: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Failed',
      value: counts.failed,
      icon: XCircle,
      iconClass: 'bg-rose-50 text-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>

                <p className="mt-2 font-['Manrope'] text-3xl font-extrabold tracking-tight text-slate-900">
                  {card.value}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconClass}`}
              >
                <Icon size={19} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}