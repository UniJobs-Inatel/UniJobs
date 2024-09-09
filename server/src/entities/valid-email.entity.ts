import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { College } from './college.entity';

@Entity()
export class ValidEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  domain: string;

  @ManyToOne(() => College, (college) => college.validEmails, {
    onDelete: 'CASCADE',
  })
  college: College;
}
