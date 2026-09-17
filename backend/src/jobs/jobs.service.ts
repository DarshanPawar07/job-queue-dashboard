import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from './dto/update-job-status.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(createJobDto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        title: createJobDto.title,
        type: createJobDto.type,
      },
    });
  }

  async getAllJobs() {
    return this.prisma.job.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateJobStatus(id: number, newStatus: JobStatus) {
  const job = await this.prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    throw new NotFoundException(`Job with ID ${id} not found`);
  }

  const currentStatus = job.status as JobStatus;

  const allowedTransitions: Record<JobStatus, JobStatus[]> = {
    pending: [JobStatus.running],
    running: [JobStatus.completed, JobStatus.failed],
    completed: [],
    failed: [],
  };

  if (!allowedTransitions[currentStatus].includes(newStatus)) {
    throw new BadRequestException(
      `Cannot change job status from ${currentStatus} to ${newStatus}`,
    );
  }

  // Atomic conditional update.
  // The update only succeeds if the job still has the
  // status we read above.
  const result = await this.prisma.job.updateMany({
    where: {
      id,
      status: currentStatus,
    },
    data: {
      status: newStatus,
    },
  });

  if (result.count === 0) {
    throw new BadRequestException(
      `Job status changed before this request could be completed`,
    );
  }

  return this.prisma.job.findUnique({
    where: { id },
  });
}

async deleteJob(id: number) {
  const job = await this.prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    throw new NotFoundException(`Job with ID ${id} not found`);
  }

  return this.prisma.job.delete({
    where: { id },
  });
}
}

