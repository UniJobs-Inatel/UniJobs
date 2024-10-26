import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { College } from './college.entity';
import { Student } from './student.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => College, (college) => college.services, {
    onDelete: 'CASCADE',
  })
  college: College;

  @ManyToOne(() => Student, (student) => student.services, {
    onDelete: 'CASCADE',
  })
  student: Student;
}
