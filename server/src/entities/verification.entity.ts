import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Verification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  verificationCode: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
