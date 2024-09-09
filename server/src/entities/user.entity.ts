import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from './student.entity';
import { Company } from './company.entity';
import { College } from './college.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['created', 'confirmed', 'complete'] })
  status: string;

  @Column({ type: 'enum', enum: ['student', 'college', 'company'] })
  type: string;

  @OneToMany(() => Student, (student) => student.user)
  students: Student[];

  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];

  @OneToMany(() => College, (college) => college.user)
  colleges: College[];
}
