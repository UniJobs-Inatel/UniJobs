import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ unique: true })
  cnpj: string;

  @Column()
  field_of_activity: string;

  @Column({ nullable: true })
  contact_website: string;

  @ManyToOne(() => User, (user) => user.companies, { onDelete: 'CASCADE' })
  user: User;
}
