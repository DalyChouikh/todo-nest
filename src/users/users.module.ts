import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Todo } from './entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Todo])],
})
export class UsersModule {}
