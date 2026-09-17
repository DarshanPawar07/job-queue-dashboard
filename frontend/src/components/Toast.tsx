import { CheckCircle2, X, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

export default function Toast({
  type,
  message,
  onClose,
}: ToastProps) {
  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed right-5 top-5 z-[100] flex w-[calc(100%-2.5rem)] max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl shadow-slate-900/10 ${
        isSuccess
          ? 'border-emerald-200'
          : 'border-rose-200'
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          isSuccess
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-rose-50 text-rose-600'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 size={19} />
        ) : (
          <XCircle size={19} />
        )}
      </div>

      {/* Message */}
      <div className="min-w-0 flex-1 pt-0.5">
        <p
          className={`text-sm font-semibold ${
            isSuccess
              ? 'text-emerald-800'
              : 'text-rose-800'
          }`}
        >
          {isSuccess ? 'Success' : 'Something went wrong'}
        </p>

        <p className="mt-0.5 text-sm leading-5 text-slate-500">
          {message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}