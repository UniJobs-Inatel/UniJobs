import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Job } from './job.entity';
import { College } from './college.entity';
import { Company } from './company.entity';

@Entity()
export class JobPublication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.jobPublications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => College, (college) => college.jobPublications, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'college_id' })
  college: College;

  @ManyToOne(() => Company, (company) => company.jobPublications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'reproved', 'removed'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publication_request_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  publication_date: Date | null;
}
