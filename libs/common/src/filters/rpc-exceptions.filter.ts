import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { RpcErrorBody, isRpcErrorBody } from '@haydigo/contracts';
import { INTERNAL_ERROR_MESSAGE } from '../constants/error-messages.constants';

@Catch()
export class RpcExceptionsFilter implements RpcExceptionFilter<unknown> {
  private readonly logger = new Logger(RpcExceptionsFilter.name);

  catch(exception: unknown): Observable<never> {
    return throwError(() => this.toRpcErrorBody(exception));
  }

  private toRpcErrorBody(exception: unknown): RpcErrorBody {
    if (exception instanceof HttpException && !isServerError(exception)) {
      return { statusCode: exception.getStatus(), message: exception.message };
    }
    if (exception instanceof RpcException) {
      const error = exception.getError();
      if (isRpcErrorBody(error)) {
        return error;
      }
    }
    this.logger.error(
      'Unhandled error',
      exception instanceof Error ? exception.stack : String(exception),
    );
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: INTERNAL_ERROR_MESSAGE,
    };
  }
}

function isServerError(exception: HttpException): boolean {
  return exception.getStatus() >= HttpStatus.INTERNAL_SERVER_ERROR;
}
