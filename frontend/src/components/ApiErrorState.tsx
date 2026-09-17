import { RefreshCw, ServerCrash } from 'lucide-react';

interface ApiErrorStateProps {
  onRetry: () => void;
  refreshing: boolean;
}

export default function ApiErrorState({
  onRetry,
  refreshing,
}: ApiErrorStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <ServerCrash size={25} strokeWidth={1.8} />
      </div>

      <h3 className="mt-5 font-['Manrope'] text-lg font-extrabold text-slate-900">
        Unable to load jobs
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        We couldn't connect to the backend. Make sure the
        API is running and try again.
      </p>

      <button
        onClick={onRetry}
        disabled={refreshing}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw
          size={16}
          className={
            refreshing ? 'animate-spin' : ''
          }
        />

        Try again
      </button>
    </div>
  );
}