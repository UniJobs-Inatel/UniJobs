import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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
    unique: true,
  })
  field: string;

  @OneToMany(() => Job, (job) => job.field)
  jobs: Job[];
}
