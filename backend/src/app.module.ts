import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { JobsModule } from './jobs/jobs.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JobsModule,
    HealthModule,
  ],
})
export class AppModule {}