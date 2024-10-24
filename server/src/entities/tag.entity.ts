import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StudentProficiency } from './student-proficiency.entity';
import { JobTag } from './job-tag.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => StudentProficiency,
    (studentProficiency) => studentProficiency.tag,
  )
  studentProficiencies: StudentProficiency[];

  @OneToMany(() => JobTag, (jobTag) => jobTag.tag)
  jobTags: JobTag[];
}
