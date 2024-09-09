import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Student } from './student.entity';
import { Tag } from './tag.entity';

@Entity()
export class StudentProficiency {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.proficiencies, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @ManyToOne(() => Tag, (tag) => tag.studentProficiencies, {
    onDelete: 'CASCADE',
  })
  tag: Tag;
}
