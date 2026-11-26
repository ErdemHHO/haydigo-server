import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { RESPONSE_MESSAGES } from '../constants/response-messages.constants';
import { METADATA_KEYS } from '../constants/metadata.constants';
import type { ApiSuccessResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T>> {
    const message =
      this.reflector.get<string | undefined>(
        METADATA_KEYS.responseMessage,
        context.getHandler(),
      ) ?? RESPONSE_MESSAGES.success;
    return next
      .handle()
      .pipe(map((data) => ({ success: true as const, message, data })));
  }
}
