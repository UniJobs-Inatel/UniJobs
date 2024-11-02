import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { Tag } from './tag.entity';

@Entity()
export class StudentProficiency {
  @PrimaryColumn()
  student_id: number;

  @PrimaryColumn()
  tag_id: number;

  @ManyToOne(() => Student, (student) => student.proficiencies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Tag, (tag) => tag.studentProficiencies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
