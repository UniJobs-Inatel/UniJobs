import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { JobPublication } from './job-publication.entity';
import { Student } from './student.entity';

@Entity('favorite_jobs')
export class FavoriteJobs {
  @PrimaryColumn()
  job_publication_id: number;

  @PrimaryColumn()
  student_id: number;

  @ManyToOne(() => JobPublication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_publication_id' })
  jobPublication: JobPublication;

  @ManyToOne(() => Student, (student) => student.favoriteJobs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
