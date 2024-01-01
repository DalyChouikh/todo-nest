import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateTodoDto, CreateUserDto } from './dto';

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
}
