import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '../entities/status.enum';

export class FilterTodosDto {
  @IsOptional()
  @IsString()
  title: string = '';

  @IsEnum(Status)
  @IsOptional()
  status: Status;
}
