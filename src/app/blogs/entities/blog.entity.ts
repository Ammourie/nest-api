import { User } from 'src/app/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { AfterUpdate } from 'typeorm';
@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: false })
  approved: boolean;
  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.blogs)
  user: User;

  @AfterUpdate()
  updateUpdatedAt() {
    this.updated_at = new Date();
  }
}
