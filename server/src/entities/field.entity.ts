import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Job } from './job.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: [
      'it',
      'engineering',
      'exact_sciences',
      'humanities',
      'business',
      'health',
      'arts',
      'agriculture',
      'law',
      'education',
    ],
  })
  field: string;

  @OneToMany(() => Course, (course) => course.field)
  courses: Course[];

  @OneToMany(() => Job, (job) => job.field)
  jobs: Job[];
}
