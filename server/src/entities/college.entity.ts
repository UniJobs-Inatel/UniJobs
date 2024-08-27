import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from './company.entity';
import { ValidEmail } from './valid-email.entity';
import { Student } from './student.entity';
import { Course } from './course.entity';
import { Service } from './service.entity';
import { JobPublication } from './job-publication.entity';
import { User } from './user.entity';

@Entity()
export class College {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @OneToMany(() => ValidEmail, (validEmail) => validEmail.college)
  validEmails: ValidEmail[];

  @OneToMany(() => Student, (student) => student.college)
  students: Student[];

  @OneToMany(() => Course, (course) => course.college)
  courses: Course[];

  @OneToMany(() => Service, (service) => service.college)
  services: Service[];

  @OneToMany(() => JobPublication, (jobPublication) => jobPublication.college)
  jobPublications: JobPublication[];

  @ManyToOne(() => User, (user) => user.colleges, { onDelete: 'CASCADE' })
  user: User;
}

