import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (
      exception.message.includes(
        'duplicate key value violates unique constraint',
      )
    ) {
      const errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Username already exists',
      };

      response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    } else {
      const errorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  }
}
