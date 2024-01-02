import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Status } from '../entities/status.enum';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
