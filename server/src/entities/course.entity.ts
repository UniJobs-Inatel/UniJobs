import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Field } from './field.entity';
import { College } from './college.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Field, (field) => field.courses, { onDelete: 'CASCADE' })
  field: Field;

  @ManyToOne(() => College, (college) => college.courses, {
    onDelete: 'CASCADE',
  })
  college: College;
}

