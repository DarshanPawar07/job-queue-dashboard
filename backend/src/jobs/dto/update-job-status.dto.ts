import { IsEnum } from 'class-validator';

export enum JobStatus {
  pending = 'pending',
  running = 'running',
  completed = 'completed',
  failed = 'failed',
}

export class UpdateJobStatusDto {
  @IsEnum(JobStatus)
  status: JobStatus;
}