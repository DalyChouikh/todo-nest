import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto implements Partial<CreateTodoDto> {}
