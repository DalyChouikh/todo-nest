import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto, CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}

  async findAllTodos(id: string) {
    return await this.todoRepository.find({
      where: { id: +id },
      relations: { user: true },
    });
  }

  async findAllUsers() {
    return await this.userRepository.find({
      relations: ['todos'],
    });
  }

  createUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async createTodo(id: string, createTodoDto: CreateTodoDto) {
    const user = await this.userRepository.findOneBy({ id: +id });
    const todo = this.todoRepository.create({ ...createTodoDto, user });
    return this.todoRepository.save(todo);
  }
}
