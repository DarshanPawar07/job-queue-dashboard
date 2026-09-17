import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';

import Header, {
  type ApiStatus,
} from './components/Header';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import StatusCards from './components/StatusCards';
import StatusFilter, {
  type StatusFilterValue,
} from './components/StatusFilter';
import Toast, {
  type ToastType,
} from './components/Toast';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ApiErrorState from './components/ApiErrorState';

import {
  checkHealth,
  deleteJob,
  getJobs,
  updateJobStatus,
} from './services/api';

import type { Job, JobStatus } from './types/job';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] =
    useState<StatusFilterValue>('all');

  const [showCreateJob, setShowCreateJob] =
    useState(false);

  const [jobToDelete, setJobToDelete] =
    useState<Job | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [apiStatus, setApiStatus] =
    useState<ApiStatus>('checking');

  const [apiError, setApiError] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const loadJobs = async (showRefresh = false) => {
    const maxAttempts = 4;
    const retryDelays = [3000, 5000, 8000];

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setApiStatus('checking');
      setApiError(false);

      for (
        let attempt = 1;
        attempt <= maxAttempts;
        attempt++
      ) {
        try {
          const [jobsData] = await Promise.all([
            getJobs(),
            checkHealth(),
          ]);

          setJobs(jobsData);
          setApiStatus('connected');
          setApiError(false);

          return;
        } catch (error) {
          console.error(
            `API connection attempt ${attempt} failed:`,
            error,
          );

          if (attempt < maxAttempts) {
            await sleep(retryDelays[attempt - 1]);
          }
        }
      }

      setApiStatus('offline');
      setApiError(true);

      setToast({
        type: 'error',
        message:
          'Unable to connect to the backend API. Please try again.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(
      () => setToast(null),
      4000,
    );

    return () => clearTimeout(timer);
  }, [toast]);

  const filteredJobs = useMemo(() => {
    if (filter === 'all') {
      return jobs;
    }

    return jobs.filter(
      (job) => job.status === filter,
    );
  }, [jobs, filter]);

  const handleStatusChange = async (
    id: number,
    status: JobStatus,
  ) => {
    try {
      setUpdatingId(id);

      const updatedJob = await updateJobStatus(
        id,
        { status },
      );

      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === id ? updatedJob : job,
        ),
      );

      setToast({
        type: 'success',
        message: `Job status changed to ${status}.`,
      });
    } catch (error) {
      console.error(
        'Failed to update job status:',
        error,
      );

      setToast({
        type: 'error',
        message:
          'Unable to update the job status. Please try again.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = (id: number) => {
    const job = jobs.find(
      (currentJob) => currentJob.id === id,
    );

    if (!job) return;

    setJobToDelete(job);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      setDeletingId(jobToDelete.id);

      await deleteJob(jobToDelete.id);

      setJobs((currentJobs) =>
        currentJobs.filter(
          (job) => job.id !== jobToDelete.id,
        ),
      );

      setJobToDelete(null);

      setToast({
        type: 'success',
        message: 'The job has been deleted.',
      });
    } catch (error) {
      console.error(
        'Failed to delete job:',
        error,
      );

      setToast({
        type: 'error',
        message:
          'Unable to delete the job. Please try again.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleJobCreated = (job: Job) => {
    setJobs((currentJobs) => [
      job,
      ...currentJobs,
    ]);

    setToast({
      type: 'success',
      message:
        'Your new job has been added to the queue.',
    });
  };

  return (
    <div className="min-h-screen">
      <Header apiStatus={apiStatus} />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Hero */}
        <section className="mb-7 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-semibold text-indigo-600">
              Operations
            </p>

            <h2 className="font-['Manrope'] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Job Queue
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Monitor, manage, and control your
              background jobs from one place.
            </p>
          </div>

          <button
            onClick={() =>
              setShowCreateJob(true)
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 hover:shadow-indigo-600/30 active:scale-[0.98] sm:w-auto sm:px-4 sm:py-2.5"
          >
            <Plus size={18} />
            Create Job
          </button>
        </section>

        {/* Status Cards */}
        <StatusCards jobs={jobs} />

        {/* Jobs Section */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm sm:mt-8">
          <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5">
            <div>
              <h3 className="font-['Manrope'] text-lg font-bold text-slate-900">
                Jobs
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {filteredJobs.length} job
                {filteredJobs.length !== 1
                  ? 's'
                  : ''}{' '}
                displayed
              </p>
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button
                onClick={() => loadJobs(true)}
                disabled={refreshing}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                title="Refresh jobs"
                aria-label="Refresh jobs"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? 'animate-spin'
                      : ''
                  }
                />
              </button>

              <StatusFilter
                value={filter}
                onChange={setFilter}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center px-4">
              <div className="flex max-w-md flex-col items-center text-center">
                <span className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

                <p className="text-sm font-semibold text-slate-700">
                  Connecting to backend...
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  The server may be waking up from
                  inactivity. We&apos;ll automatically
                  retry the connection.
                </p>
              </div>
            </div>
          ) : apiError ? (
            <ApiErrorState
              onRetry={() => loadJobs(true)}
              refreshing={refreshing}
            />
          ) : (
            <JobList
              jobs={filteredJobs}
              filtered={filter !== 'all'}
              onCreateJob={() =>
                setShowCreateJob(true)
              }
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              updatingId={updatingId}
              deletingId={deletingId}
            />
          )}
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200/70 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 QueueFlow. All rights reserved.
          </p>

          <p className="font-medium">
            Build · Process · Deliver
          </p>
        </footer>
      </main>

      {/* Create Job Modal */}
      {showCreateJob && (
        <JobForm
          onClose={() =>
            setShowCreateJob(false)
          }
          onCreated={handleJobCreated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <DeleteConfirmModal
          jobTitle={jobToDelete.title}
          deleting={
            deletingId === jobToDelete.id
          }
          onCancel={() => {
            if (!deletingId) {
              setJobToDelete(null);
            }
          }}
          onConfirm={confirmDelete}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;