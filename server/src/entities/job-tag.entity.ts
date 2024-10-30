import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Job } from './job.entity';
import { Tag } from './tag.entity';

@Entity('job_tag')
export class JobTag {
  @PrimaryColumn()
  job_id: number;

  @PrimaryColumn()
  tag_id: number;

  @ManyToOne(() => Job, (job) => job.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => Tag, (tag) => tag.jobTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
