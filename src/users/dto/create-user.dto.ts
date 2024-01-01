import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @MinLength(8)
  @IsString()
  password: string;
}
