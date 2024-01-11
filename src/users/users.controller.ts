import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateTodoDto, UpdateTodoDto, UpdateUserDto } from './dto';
import { GetUser } from 'src/common/decorators';
import { FilterTodosDto } from './dto/filter-todo.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Post(':id')
  createTodo(
    @GetUser('sub') sub: number,
    @Param('id') id: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    if (sub !== +id) throw new UnauthorizedException();
    return this.userService.createTodo(id, createTodoDto);
  }

  @Get(':id')
  findUserById(@GetUser('sub') sub: number, @Param('id') id: string) {
    if (sub !== +id) throw new UnauthorizedException();
    return this.userService.findUserById(id);
  }

  @Get(':userId/todos/:id')
  findTodoById(
    @GetUser('sub') sub: number,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    if (sub !== +userId) throw new UnauthorizedException();
    return this.userService.findTodoById(userId, id);
  }

  @Get(':id/todos')
  findUserTodos(
    @GetUser('sub') sub: number,
    @Param('id') id: string,
    @Query() filterTodosDto: FilterTodosDto,
  ) {
    if (sub !== +id) throw new UnauthorizedException();
    if (Object.keys(filterTodosDto).length)
      return this.userService.findTodoWithFilters(id, filterTodosDto);
    return this.userService.findUserTodos(id);
  }

  @Delete(':userId/todos/:id')
  deleteTodoById(
    @GetUser('sub') sub: number,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    if (sub !== +userId) throw new UnauthorizedException();
    return this.userService.deleteTodoById(userId, id);
  }

  @Patch(':userId/todos/:id')
  updateTodoById(
    @GetUser('sub') sub: number,
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    if (sub !== +userId) throw new UnauthorizedException();
    return this.userService.updateTodoById(userId, id, updateTodoDto);
  }

  @Patch(':id')
  updateUserById(
    @GetUser('sub') sub: number,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (sub !== +id) throw new UnauthorizedException();
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUserById(@GetUser('sub') sub: number, @Param('id') id: string) {
    if (sub !== +id) throw new UnauthorizedException();
    return this.userService.deleteUser(id);
  }
}
