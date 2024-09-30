import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { Job } from '../entities/job.entity';
import { JobPublication } from '../entities/job-publication.entity';
import { Company } from '../entities/company.entity';
import { College } from '../entities/college.entity';
import { Field } from '../entities/field.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, JobPublication, Company, College, Field]),
  ],
  providers: [JobService],
  controllers: [JobController],
})
export class JobModule {}
