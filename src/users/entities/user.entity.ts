import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from './todo.entity';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true, length: 300 })
  refreshToken: string;
}
