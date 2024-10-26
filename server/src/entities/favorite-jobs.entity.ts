import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JobPublication } from './job-publication.entity';
import { Student } from './student.entity';

@Entity('favorite_jobs')
export class FavoriteJobs {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobPublication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_publication_id' })
  jobPublication: JobPublication;

  @ManyToOne(() => Student, (student) => student.favoriteJobs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
