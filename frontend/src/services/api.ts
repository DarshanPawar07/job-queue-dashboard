import axios from 'axios';
import type {
  CreateJobPayload,
  Job,
  UpdateJobStatusPayload,
} from '../types/job';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getJobs = async (): Promise<Job[]> => {
  const response = await api.get<Job[]>('/jobs');
  return response.data;
};

export const createJob = async (
  data: CreateJobPayload,
): Promise<Job> => {
  const response = await api.post<Job>('/jobs', data);
  return response.data;
};

export const updateJobStatus = async (
  id: number,
  data: UpdateJobStatusPayload,
): Promise<Job> => {
  const response = await api.patch<Job>(
    `/jobs/${id}/status`,
    data,
  );
  return response.data;
};

export const deleteJob = async (id: number): Promise<Job> => {
  const response = await api.delete<Job>(`/jobs/${id}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};