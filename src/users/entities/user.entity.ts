import {
  AfterRemove,
  AfterUpdate,
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Column()
  @Unique(['email'])
  email: string;

  @Column()
  password: string;
  
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
