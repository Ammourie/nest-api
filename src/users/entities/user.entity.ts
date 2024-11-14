import { Blog } from '../..//blogs/entities/blog.entity';
import {
  AfterRemove,
  AfterUpdate,
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  // Primary Key
  @PrimaryGeneratedColumn()
  id: number;

  // User Information
  @Column()
  email: string;

  @Column()
  fullName: string;

  @Column()
  password: string;

  // User Roles and Permissions
  @Column({ default: false })
  isAdmin: boolean;

  // Optional Fields
  @Column({ nullable: true })
  access_token: string;

  // Relationships
  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  // Lifecycle Hooks
  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
