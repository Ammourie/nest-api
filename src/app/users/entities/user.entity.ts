import { Blog } from 'src/app/blogs/entities/blog.entity';
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  fullName: string;

  @Column()
  password: string;
  @Column({ default: true })
  isAdmin: boolean;
  @Column({ nullable: true })
  access_token: string;
  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

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
