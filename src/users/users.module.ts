import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Todo } from './entities/todo.entity';
import { UserService } from './user.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Todo])],
  providers: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}
