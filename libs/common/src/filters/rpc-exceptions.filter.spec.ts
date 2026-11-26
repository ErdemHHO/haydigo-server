import {
  ConflictException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { INTERNAL_ERROR_MESSAGE } from '../constants/error-messages.constants';
import { RpcExceptionsFilter } from './rpc-exceptions.filter';

function sent(exception: unknown): Promise<unknown> {
  return firstValueFrom(new RpcExceptionsFilter().catch(exception)).catch(
    (body: unknown) => body,
  );
}

describe('RpcExceptionsFilter', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  it('sends a Nest exception with its status and message', async () => {
    await expect(
      sent(new ConflictException('Bu e-posta adresi zaten kayıtlı')),
    ).resolves.toEqual({
      statusCode: HttpStatus.CONFLICT,
      message: 'Bu e-posta adresi zaten kayıtlı',
    });
  });

  it('passes on an RpcException that already has the error shape', async () => {
    await expect(
      sent(new RpcException({ statusCode: 404, message: 'Yok' })),
    ).resolves.toEqual({ statusCode: 404, message: 'Yok' });
  });

  it.each([
    ['an unexpected error', new Error('connect ECONNREFUSED')],
    ['a 5xx Nest exception', new InternalServerErrorException('SQL failed')],
  ])('sends %s as a 500 without details', async (_, exception) => {
    await expect(sent(exception)).resolves.toEqual({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: INTERNAL_ERROR_MESSAGE,
    });
  });
});
