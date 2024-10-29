import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { Experience } from '../entities/experience.entity';
import { Company } from '../entities/company.entity';
import { College } from '../entities/college.entity';
import { ValidEmail } from '../entities/valid-email.entity';
import { Field } from '../entities/field.entity';
import { Job } from '../entities/job.entity';
import { Service } from '../entities/service.entity';
import { JobPublication } from '../entities/job-publication.entity';
import { FavoriteJobs } from '../entities/favorite-jobs.entity';
import { Verification } from 'src/entities/verification.entity';
import { Tag } from '../entities/tag.entity';
import { StudentProficiency } from '../entities/student-proficiency.entity';
import { JobTag } from '../entities/job-tag.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Student,
        Experience,
        Company,
        College,
        ValidEmail,
        Field,
        Job,
        Service,
        JobPublication,
        FavoriteJobs,
        Verification,
        Tag,
        StudentProficiency,
        JobTag,
      ],
      synchronize: false,
    }),
  ],
})
export class DatabaseModule {}
