import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Job } from './job.entity';
import { Student } from './student.entity';

@Entity()
export class FavoriteJobs {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.id, { onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => Student, (student) => student.favoriteJobs, {
    onDelete: 'CASCADE',
  })
  student: Student;
}
