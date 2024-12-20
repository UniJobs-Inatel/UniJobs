import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { College } from './college.entity';
import { Experience } from './experience.entity';
import { Service } from './service.entity';
import { FavoriteJobs } from './favorite-jobs.entity';
import { StudentProficiency } from './student-proficiency.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  cpf: string;

  @ManyToOne(() => User, (user) => user.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => College, (college) => college.students, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'college_id' })
  college: College;

  @OneToMany(() => Experience, (experience) => experience.student)
  experiences: Experience[];

  @OneToMany(() => Service, (service) => service.student)
  services: Service[];

  @OneToMany(() => FavoriteJobs, (favoriteJobs) => favoriteJobs.student)
  favoriteJobs: FavoriteJobs[];

  @OneToMany(
    () => StudentProficiency,
    (studentProficiency) => studentProficiency.student,
  )
  proficiencies: StudentProficiency[];
}
