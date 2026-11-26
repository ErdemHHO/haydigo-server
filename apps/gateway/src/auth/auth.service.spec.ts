import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserDto } from '@haydigo/contracts';
import type { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AUTH_MESSAGES } from './constants/auth.constants';

const USER: UserDto = {
  id: '7f1c1a52-6b6c-4f4f-9a51-4a1a3c3d2e10',
  email: 'ada@example.com',
  fullName: 'Ada Lovelace',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('AuthService', () => {
  const jwtService = new JwtService({ secret: 'x'.repeat(32) });
  let usersService: jest.Mocked<UsersService>;
  let service: AuthService;

  beforeEach(() => {
    usersService = {
      register: jest.fn().mockResolvedValue(USER),
      verifyCredentials: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;
    service = new AuthService(usersService, jwtService);
  });

  it('issues a token for the registered user', async () => {
    const { accessToken, user } = await service.register({
      email: USER.email,
      password: 'secret-password',
      fullName: USER.fullName,
    });

    expect(user).toEqual(USER);
    await expect(jwtService.verifyAsync(accessToken)).resolves.toMatchObject({
      sub: USER.id,
    });
  });

  it('issues a token when the credentials match', async () => {
    usersService.verifyCredentials.mockResolvedValue(USER);

    const { user } = await service.login({
      email: USER.email,
      password: 'secret-password',
    });

    expect(user).toEqual(USER);
  });

  it('rejects credentials that do not match', async () => {
    usersService.verifyCredentials.mockResolvedValue(null);

    await expect(
      service.login({ email: USER.email, password: 'wrong-password' }),
    ).rejects.toThrow(
      new UnauthorizedException(AUTH_MESSAGES.invalidCredentials),
    );
  });
});
