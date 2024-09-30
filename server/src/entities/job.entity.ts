import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Field } from './field.entity';
import { JobTag } from './job-tag.entity';
import { JobPublication } from './job-publication.entity';
import { Company } from './company.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  job_name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 100 })
  location: string;

  @Column({
    type: 'enum',
    enum: ['freelance', 'trainee', 'clt', 'pj', 'internship'],
  })
  type: string;

  @Column()
  weekly_hours: number;

  @Column({ type: 'enum', enum: ['on_site', 'hybrid', 'remote'] })
  mode: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ nullable: true })
  salary: number;

  @Column({ type: 'text' })
  requirements: string;

  @ManyToOne(() => Field, (field) => field.jobs, { onDelete: 'CASCADE' })
  field: Field;

  @ManyToOne(() => Company, (company) => company.jobs, { onDelete: 'CASCADE' })
  company: Company;

  @OneToMany(() => JobTag, (jobTag) => jobTag.job)
  tags: JobTag[];

  @OneToMany(() => JobPublication, (jobPublication) => jobPublication.job)
  jobPublications: JobPublication[];
}
