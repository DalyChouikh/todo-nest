import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import {
  CreateTodoDto,
  CreateUserDto,
  UpdateTodoDto,
  UpdateUserDto,
} from './dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}

  async findAllUsers() {
    return await this.userRepository.find({
      relations: ['todos'],
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    createUserDto.password = await hash(createUserDto.password, 10);
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async createTodo(id: string, createTodoDto: CreateTodoDto) {
    const user = await this.userRepository.findOneBy({ id: +id });
    const todo = this.todoRepository.create({ ...createTodoDto, user });
    return this.todoRepository.save(todo);
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: +id },
      relations: ['todos'],
    });
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async findTodoById(userId: string, id: string) {
    const user = await this.userRepository.findOneBy({ id: +userId });
    if (!user) throw new NotFoundException('User Not Found');
    const todo = await this.todoRepository.findOneBy({ id: +id, user });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async findTodoByTitle(id: string, title: string = '') {
    const user = await this.userRepository.findOneBy({ id: +id });
    if (!user) throw new NotFoundException('User Not Found');
    return await this.todoRepository.find({
      where: { title: ILike(`${title}%`), user },
    });
  }

  async deleteTodoById(userId: string, id: string) {
    const user = await this.userRepository.findOneBy({ id: +userId });
    if (!user) throw new NotFoundException('User Not Found');
    const todo = await this.todoRepository.findOneBy({ id: +id, user });
    if (!todo) throw new NotFoundException('Todo not found');
    await this.todoRepository.delete({ id: +id, user: user });
    return { statusCode: 200, message: 'Todo deleted successfully' };
  }

  async updateTodoById(
    userId: string,
    id: string,
    updateTodoDto: UpdateTodoDto,
  ) {
    const user = await this.userRepository.findOneBy({ id: +userId });
    if (!user) throw new NotFoundException('User Not Found');
    const todo = await this.todoRepository.preload({
      id: +id,
      userId: +userId,
      ...updateTodoDto,
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return await this.todoRepository.save(todo);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const newPassword = await hash(updateUserDto.password, 10);
      updateUserDto.password = newPassword;
    }
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return await this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: +id },
      relations: ['todos'],
    });
    if (!user) throw new NotFoundException('User Not Found');
    await this.userRepository.delete({ id: +id });
    return { statusCode: 200, message: 'User deleted successfully' };
  }
}
