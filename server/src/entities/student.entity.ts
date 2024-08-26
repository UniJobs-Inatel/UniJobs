import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { College } from './college.entity';
import { Experience } from './experience.entity';
import { Service } from './service.entity';
import { FavoriteJobs } from './favorite-jobs.entity';

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
  user: User;

  @ManyToOne(() => College, (college) => college.students, {
    onDelete: 'SET NULL',
  })
  college: College;

  @OneToMany(() => Experience, (experience) => experience.student)
  experiences: Experience[];

  @OneToMany(() => Service, (service) => service.student)
  services: Service[];

  @OneToMany(() => FavoriteJobs, (favoriteJobs) => favoriteJobs.student)
  favoriteJobs: FavoriteJobs[];
}
