import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, of } from 'rxjs';
import { RESPONSE_MESSAGES } from '../constants/response-messages.constants';
import { ResponseMessage } from '../decorators/response-message.decorator';
import { ResponseInterceptor } from './response.interceptor';

class ExampleController {
  plain(): void {}

  @ResponseMessage('Kayıt başarılı')
  withMessage(): void {}
}

function contextFor(handler: () => void): ExecutionContext {
  return { getHandler: () => handler } as unknown as ExecutionContext;
}

describe('ResponseInterceptor', () => {
  const interceptor = new ResponseInterceptor(new Reflector());
  const next: CallHandler = { handle: () => of({ id: '1' }) };

  it('wraps the result with the default message', async () => {
    await expect(
      firstValueFrom(
        interceptor.intercept(
          contextFor(ExampleController.prototype.plain),
          next,
        ),
      ),
    ).resolves.toEqual({
      success: true,
      message: RESPONSE_MESSAGES.success,
      data: { id: '1' },
    });
  });

  it('uses the message set with @ResponseMessage()', async () => {
    const response = await firstValueFrom(
      interceptor.intercept(
        contextFor(ExampleController.prototype.withMessage),
        next,
      ),
    );

    expect(response.message).toBe('Kayıt başarılı');
  });
});
