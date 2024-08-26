import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ValidEmail } from './valid-email.entity';
import { Student } from './student.entity';
import { Course } from './course.entity';
import { Service } from './service.entity';
import { JobPublication } from './job-publication.entity';

@Entity()
export class College {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ValidEmail, (validEmail) => validEmail.college)
  validEmails: ValidEmail[];

  @OneToMany(() => Student, (student) => student.college)
  students: Student[];

  @OneToMany(() => Course, (course) => course.college)
  course: Course[];

  @OneToMany(() => Service, (service) => service.college)
  services: Service[];

  @OneToMany(() => JobPublication, (jobPublication) => jobPublication.college)
  jobPublications: JobPublication[];
}
