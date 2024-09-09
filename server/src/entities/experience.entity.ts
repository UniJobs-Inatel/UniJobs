import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Student } from './student.entity';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['professional', 'academic'] })
  type: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Student, (student) => student.experiences, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @Column({ type: 'varchar', length: 255 })
  company_name: string;

  @Column({ type: 'varchar', length: 100 })
  position: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;
}
