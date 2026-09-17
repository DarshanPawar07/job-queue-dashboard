import { Activity, Layers3 } from 'lucide-react';

export type ApiStatus = 'checking' | 'connected' | 'offline';

interface HeaderProps {
  apiStatus: ApiStatus;
}

export default function Header({
  apiStatus,
}: HeaderProps) {
  const statusConfig = {
    checking: {
      label: 'Connecting...',
      className:
        'border-amber-200 bg-amber-50 text-amber-700',
    },
    connected: {
      label: 'API Online',
      className:
        'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
    offline: {
      label: 'API Offline',
      className:
        'border-rose-200 bg-rose-50 text-rose-700',
    },
  };

  const currentStatus = statusConfig[apiStatus];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <Layers3 size={19} strokeWidth={2.3} />
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate font-['Manrope'] text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
              QueueFlow
            </h1>

            <span className="hidden rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:inline-block">
              Dashboard
            </span>
          </div>
        </div>

        {/* API Status */}
        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${currentStatus.className}`}
        >
          <Activity
            size={13}
            className={
              apiStatus === 'checking'
                ? 'animate-pulse'
                : ''
            }
          />

          <span>{currentStatus.label}</span>
        </div>
      </div>
    </header>
  );
}