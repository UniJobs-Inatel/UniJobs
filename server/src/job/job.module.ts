import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { Job } from '../entities/job.entity';
import { JobPublication } from '../entities/job-publication.entity';
import { JobTag } from '../entities/job-tag.entity';
import { Company } from '../entities/company.entity';
import { College } from '../entities/college.entity';
import { Field } from '../entities/field.entity';
import { Student } from '../entities/student.entity';
import { AuthModule } from '../auth/auth.module';
import { FavoriteJobs } from 'src/entities/favorite-jobs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      JobPublication,
      FavoriteJobs,
      JobTag,
      Company,
      College,
      Field,
      Student,
    ]),
    AuthModule,
  ],
  providers: [JobService],
  controllers: [JobController],
})
export class JobModule {}
