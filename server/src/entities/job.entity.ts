import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Field } from './field.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  job_name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
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
  salary_range: string;

  @Column({ type: 'text' })
  requirements: string;

  @ManyToOne(() => Field, (field) => field.jobs, { onDelete: 'CASCADE' })
  field: Field;
}
