import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateTodoDto,
  CreateUserDto,
  UpdateTodoDto,
  UpdateUserDto,
} from './dto';
import { Public } from 'src/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post(':id')
  createTodo(@Param('id') id: string, @Body() createTodoDto: CreateTodoDto) {
    return this.userService.createTodo(id, createTodoDto);
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Get(':userId/todos/:id')
  findTodoById(@Param('userId') userId: string, @Param('id') id: string) {
    return this.userService.findTodoById(userId, id);
  }

  @Get(':id/todos')
  findUserTodos(
    @Param('id') id: string,
    @Query() title: { title: string } = { title: '' },
  ) {
    return this.userService.findTodoByTitle(id, title.title);
  }

  @Delete(':userId/todos/:id')
  deleteTodoById(@Param('userId') userId: string, @Param('id') id: string) {
    return this.userService.deleteTodoById(userId, id);
  }

  @Patch(':userId/todos/:id')
  updateTodoById(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.userService.updateTodoById(userId, id, updateTodoDto);
  }

  @Patch(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
