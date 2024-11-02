import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { College } from './college.entity';

@Entity()
export class ValidEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  domain: string;

  @ManyToOne(() => College, (college) => college.validEmails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'college_id' })
  college: College;
}
