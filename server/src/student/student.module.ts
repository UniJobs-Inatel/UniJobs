import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { Experience } from '../entities/experience.entity';
import { StudentProficiency } from '../entities/student-proficiency.entity';
import { ValidEmail } from '../entities/valid-email.entity';
import { College } from '../entities/college.entity';
import { User } from '../entities/user.entity';
import { Job } from '../entities/job.entity';
import { FavoriteJobs } from '../entities/favorite-jobs.entity';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Experience,
      StudentProficiency,
      ValidEmail,
      College,
      User,
      Job,
      FavoriteJobs,
    ]),
  ],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
