import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Job } from './job.entity';
import { JobPublication } from './job-publication.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 14, unique: true })
  cnpj: string;

  @Column({ length: 100 })
  field_of_activity: string;

  @Column({ length: 255, nullable: true })
  contact_website: string;

  @ManyToOne(() => User, (user) => user.companies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];

  @OneToMany(() => JobPublication, (jobPublication) => jobPublication.company)
  jobPublications: JobPublication[];
}
