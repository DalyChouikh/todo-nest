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

  @Column({
    default: Status.IN_PROGRESS,
    enum: [Status.DOING, Status.DONE, Status.IN_PROGRESS],
    enumName: 'Status',
  })
  status: Status;

  @ManyToOne(() => User, (user) => user.todos, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  userId: number;
}
