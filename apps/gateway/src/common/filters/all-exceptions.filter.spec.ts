import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TimeoutError } from 'rxjs';
import { INTERNAL_ERROR_MESSAGE } from '@haydigo/common';
import { RESPONSE_MESSAGES } from '../constants/response-messages.constants';
import { AllExceptionsFilter } from './all-exceptions.filter';

function respond(exception: unknown): { status: number; body: unknown } {
  const result = { status: 0, body: undefined as unknown };
  interface FakeResponse {
    status(status: number): FakeResponse;
    json(body: unknown): void;
  }
  const response: FakeResponse = {
    status(status) {
      result.status = status;
      return response;
    },
    json(body) {
      result.body = body;
    },
  };
  const host = {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;
  new AllExceptionsFilter().catch(exception, host);
  return result;
}

describe('AllExceptionsFilter', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  it('keeps the status and message of an HTTP exception', () => {
    expect(respond(new NotFoundException('İşletme bulunamadı'))).toEqual({
      status: 404,
      body: {
        success: false,
        message: 'İşletme bulunamadı',
        errors: [],
        statusCode: 404,
      },
    });
  });

  it('lists validation messages in errors', () => {
    const { body } = respond(
      new BadRequestException(['email must be an email', 'name too short']),
    );

    expect(body).toEqual({
      success: false,
      message: RESPONSE_MESSAGES.validationFailed,
      errors: ['email must be an email', 'name too short'],
      statusCode: 400,
    });
  });

  it('keeps the status of an error a service sent', () => {
    const { status, body } = respond({
      statusCode: 409,
      message: 'Bu e-posta adresi zaten kayıtlı',
    });

    expect(status).toBe(409);
    expect(body).toMatchObject({ message: 'Bu e-posta adresi zaten kayıtlı' });
  });

  it('answers 503 when no instance of a service is running', () => {
    class EmptyResponseException extends Error {}

    expect(respond(new EmptyResponseException('no subscribers'))).toEqual({
      status: 503,
      body: {
        success: false,
        message: RESPONSE_MESSAGES.serviceUnavailable,
        errors: [],
        statusCode: 503,
      },
    });
  });

  it('answers 504 when a service does not reply in time', () => {
    expect(respond(new TimeoutError()).status).toBe(HttpStatus.GATEWAY_TIMEOUT);
  });

  it('hides the details of unexpected errors', () => {
    expect(respond(new Error('connect ECONNREFUSED 10.0.0.5:5432'))).toEqual({
      status: 500,
      body: {
        success: false,
        message: INTERNAL_ERROR_MESSAGE,
        errors: [],
        statusCode: 500,
      },
    });
  });

  it('hides the message of a 5xx HTTP exception too', () => {
    const { body } = respond(
      new InternalServerErrorException('relation "users" does not exist'),
    );

    expect(body).toMatchObject({ message: INTERNAL_ERROR_MESSAGE });
  });
});
