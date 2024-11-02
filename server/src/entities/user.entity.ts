import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from './student.entity';
import { Company } from './company.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['created', 'confirmed', 'complete'] })
  status: 'created' | 'confirmed' | 'complete';

  @Column({ type: 'enum', enum: ['student', 'college', 'company'] })
  type: 'student' | 'college' | 'company';

  @OneToMany(() => Student, (student) => student.user)
  students: Student[];

  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];
}
