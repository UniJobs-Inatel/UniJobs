import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { StudentProficiency } from './student-proficiency.entity';
import { JobTag } from './job-tag.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(
    () => StudentProficiency,
    (studentProficiency) => studentProficiency.tag,
  )
  studentProficiencies: StudentProficiency[];

  @ManyToMany(() => JobTag, (jobTag) => jobTag.tag)
  jobTags: JobTag[];
}
