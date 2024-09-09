import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Job } from './job.entity';
import { College } from './college.entity';
import { Company } from './company.entity';

@Entity()
export class JobPublication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.id, { onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => College, (college) => college.jobPublications, {
    onDelete: 'SET NULL',
  })
  college: College;

  @ManyToOne(() => Company, (company) => company.id, { onDelete: 'CASCADE' })
  company: Company;
}
