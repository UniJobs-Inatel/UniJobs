import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Job } from './job.entity';
import { Tag } from './tag.entity';

@Entity()
export class JobTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.tags, { onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => Tag, (tag) => tag.jobTags, { onDelete: 'CASCADE' })
  tag: Tag;
}
