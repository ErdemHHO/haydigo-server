import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { TimeoutError } from 'rxjs';
import { INTERNAL_ERROR_MESSAGE } from '@haydigo/common';
import { isRpcErrorBody } from '@haydigo/contracts';
import { RESPONSE_MESSAGES } from '../constants/response-messages.constants';
import type { ApiErrorResponse } from '../interfaces/api-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const body = this.toErrorResponse(exception);
    if (body.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Request failed with ${body.statusCode}`,
        exception instanceof Error
          ? exception.stack
          : JSON.stringify(exception),
      );
    }
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(body.statusCode)
      .json(body);
  }

  private toErrorResponse(exception: unknown): ApiErrorResponse {
    if (exception instanceof HttpException) {
      return this.fromHttpException(exception);
    }
    if (isRpcErrorBody(exception)) {
      return errorResponse(
        exception.statusCode,
        safeMessage(exception.statusCode, exception.message),
      );
    }
    if (isNoSubscribers(exception)) {
      return errorResponse(
        HttpStatus.SERVICE_UNAVAILABLE,
        RESPONSE_MESSAGES.serviceUnavailable,
      );
    }
    if (exception instanceof TimeoutError) {
      return errorResponse(
        HttpStatus.GATEWAY_TIMEOUT,
        RESPONSE_MESSAGES.serviceTimeout,
      );
    }
    return errorResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      INTERNAL_ERROR_MESSAGE,
    );
  }

  private fromHttpException(exception: HttpException): ApiErrorResponse {
    const status = exception.getStatus();
    const response = exception.getResponse();
    if (
      typeof response === 'object' &&
      Array.isArray((response as { message?: unknown }).message)
    ) {
      return errorResponse(
        status,
        RESPONSE_MESSAGES.validationFailed,
        (response as { message: string[] }).message,
      );
    }
    return errorResponse(status, safeMessage(status, exception.message));
  }
}

function errorResponse(
  statusCode: number,
  message: string,
  errors: string[] = [],
): ApiErrorResponse {
  return { success: false, message, errors, statusCode };
}

function safeMessage(statusCode: number, message: string): string {
  return statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
    ? INTERNAL_ERROR_MESSAGE
    : message;
}

function isNoSubscribers(exception: unknown): boolean {
  return (
    exception instanceof Error &&
    exception.constructor.name === 'EmptyResponseException'
  );
}
