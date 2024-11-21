import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Company } from './company.entity';
import { ValidEmail } from './valid-email.entity';
import { Student } from './student.entity';
import { Service } from './service.entity';
import { JobPublication } from './job-publication.entity';
@Entity()
export class College {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => ValidEmail, (validEmail) => validEmail.college)
  validEmails: ValidEmail[];

  @OneToMany(() => Student, (student) => student.college)
  students: Student[];

  @OneToMany(() => Service, (service) => service.college)
  services: Service[];

  @OneToMany(() => JobPublication, (jobPublication) => jobPublication.college)
  jobPublications: JobPublication[];
}
