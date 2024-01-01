import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from './status.enum';
import { User } from './user.entity';

@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: Status.IN_PROGRESS })
  status: Status;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;

  @Column()
  userId: number;
}
