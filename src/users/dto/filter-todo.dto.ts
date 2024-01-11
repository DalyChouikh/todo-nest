import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../entities/status.enum';

export class FilterTodosDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string = '';

  @IsEnum(Status)
  @IsOptional()
  status: Status;
}
