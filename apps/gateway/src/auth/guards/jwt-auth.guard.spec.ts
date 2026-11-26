import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Public } from '../../common/decorators/public.decorator';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from './jwt-auth.guard';

class ExampleController {
  @Public()
  open(): void {}

  closed(): void {}
}

const USER_ID = '7f1c1a52-6b6c-4f4f-9a51-4a1a3c3d2e10';

function contextFor(
  handler: () => void,
  authorization?: string,
): { context: ExecutionContext; request: AuthenticatedRequest } {
  const request = { headers: { authorization } } as AuthenticatedRequest;
  const context = {
    getHandler: () => handler,
    getClass: () => ExampleController,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { context, request };
}

describe('JwtAuthGuard', () => {
  const jwtService = new JwtService({ secret: 'x'.repeat(32) });
  const guard = new JwtAuthGuard(jwtService, new Reflector());

  it('lets @Public() routes through without a token', async () => {
    const { context } = contextFor(ExampleController.prototype.open);

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('puts the user from a valid token on the request', async () => {
    const token = await jwtService.signAsync({ sub: USER_ID });
    const { context, request } = contextFor(
      ExampleController.prototype.closed,
      `Bearer ${token}`,
    );

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({ id: USER_ID });
  });

  it.each([
    ['no header', undefined],
    ['another scheme', 'Basic abc'],
    ['a forged token', 'Bearer abc.def.ghi'],
  ])('rejects a request with %s', async (_, authorization) => {
    const { context } = contextFor(
      ExampleController.prototype.closed,
      authorization,
    );

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects a token signed with another secret', async () => {
    const token = await new JwtService({ secret: 'y'.repeat(32) }).signAsync({
      sub: USER_ID,
    });
    const { context } = contextFor(
      ExampleController.prototype.closed,
      `Bearer ${token}`,
    );

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
