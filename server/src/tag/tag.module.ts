import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from '../entities/tag.entity';
import { StudentProficiency } from '../entities/student-proficiency.entity';
import { JobTag } from '../entities/job-tag.entity';
import { Student } from '../entities/student.entity';
import { Job } from '../entities/job.entity';
import { Company } from '../entities/company.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tag,
      StudentProficiency,
      JobTag,
      Student,
      Job,
      Company,
    ]),
    AuthModule,
  ],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
