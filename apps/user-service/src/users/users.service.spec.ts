import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { USER_MESSAGES } from './constants/users.constants';
import { User } from './entity/user.entity';
import type { CreateUserData } from './interfaces/create-user-data.interface';
import type { UsersRepository } from './repository/users.repository';
import { hashPassword } from './utils/password.util';
import { UsersService } from './users.service';

const USER_ID = '7f1c1a52-6b6c-4f4f-9a51-4a1a3c3d2e10';

function makeUser(overrides: Partial<User> = {}): User {
  return Object.assign(new User(), {
    id: USER_ID,
    email: 'ada@example.com',
    fullName: 'Ada Lovelace',
    passwordHash: '',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  });
}

describe('UsersService', () => {
  let repository: jest.Mocked<UsersRepository>;
  let service: UsersService;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      existsByEmail: jest.fn().mockResolvedValue(false),
      findByEmailWithPasswordHash: jest.fn(),
      create: jest.fn(async (data: CreateUserData) => makeUser(data)),
    } as unknown as jest.Mocked<UsersRepository>;
    service = new UsersService(repository);
  });

  describe('register', () => {
    it('stores a normalized email and a hash, never the password', async () => {
      const user = await service.register({
        email: '  Ada@Example.COM ',
        password: 'secret-password',
        fullName: ' Ada Lovelace ',
      });

      const [data] = repository.create.mock.calls[0];
      expect(data.email).toBe('ada@example.com');
      expect(data.fullName).toBe('Ada Lovelace');
      expect(data.passwordHash).toMatch(/^scrypt\$/);
      expect(user).not.toHaveProperty('passwordHash');
    });

    it('rejects an email that is already registered', async () => {
      repository.existsByEmail.mockResolvedValue(true);

      await expect(
        service.register({
          email: 'ada@example.com',
          password: 'secret-password',
          fullName: 'Ada',
        }),
      ).rejects.toThrow(
        new ConflictException(USER_MESSAGES.emailAlreadyRegistered),
      );
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('turns a unique violation from a concurrent registration into a conflict', async () => {
      repository.create.mockRejectedValue(
        new QueryFailedError('INSERT', [], { code: '23505' } as never),
      );

      await expect(
        service.register({
          email: 'ada@example.com',
          password: 'secret-password',
          fullName: 'Ada',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('verifyCredentials', () => {
    beforeEach(async () => {
      repository.findByEmailWithPasswordHash.mockResolvedValue(
        makeUser({ passwordHash: await hashPassword('secret-password') }),
      );
    });

    it('returns the user for the right password', async () => {
      await expect(
        service.verifyCredentials({
          email: 'ADA@example.com',
          password: 'secret-password',
        }),
      ).resolves.toMatchObject({ id: USER_ID, email: 'ada@example.com' });
      expect(repository.findByEmailWithPasswordHash).toHaveBeenCalledWith(
        'ada@example.com',
      );
    });

    it('returns null for a wrong password', async () => {
      await expect(
        service.verifyCredentials({
          email: 'ada@example.com',
          password: 'wrong-password',
        }),
      ).resolves.toBeNull();
    });

    it('returns null for an unknown email', async () => {
      repository.findByEmailWithPasswordHash.mockResolvedValue(null);

      await expect(
        service.verifyCredentials({
          email: 'who@example.com',
          password: 'secret-password',
        }),
      ).resolves.toBeNull();
    });
  });

  it('answers not found for an unknown id', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(USER_ID)).rejects.toThrow(
      new NotFoundException(USER_MESSAGES.notFound),
    );
  });
});
