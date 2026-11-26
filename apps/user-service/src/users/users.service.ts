import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUniqueViolation } from '@haydigo/common';
import type {
  RegisterUserPayload,
  UserDto,
  VerifyCredentialsPayload,
} from '@haydigo/contracts';
import { USER_MESSAGES } from './constants/users.constants';
import type { User } from './entity/user.entity';
import type { CreateUserData } from './interfaces/create-user-data.interface';
import { UsersRepository } from './repository/users.repository';
import { hashPassword, verifyPassword } from './utils/password.util';
import { toUserDto } from './utils/user.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(payload: RegisterUserPayload): Promise<UserDto> {
    const email = this.normalizeEmail(payload.email);
    if (await this.usersRepository.existsByEmail(email)) {
      throw new ConflictException(USER_MESSAGES.emailAlreadyRegistered);
    }
    const user = await this.createUser({
      email,
      fullName: payload.fullName.trim(),
      passwordHash: await hashPassword(payload.password),
    });
    return toUserDto(user);
  }

  async verifyCredentials(
    payload: VerifyCredentialsPayload,
  ): Promise<UserDto | null> {
    const user = await this.usersRepository.findByEmailWithPasswordHash(
      this.normalizeEmail(payload.email),
    );
    if (!user || !(await verifyPassword(payload.password, user.passwordHash))) {
      return null;
    }
    return toUserDto(user);
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(USER_MESSAGES.notFound);
    }
    return toUserDto(user);
  }

  private async createUser(data: CreateUserData): Promise<User> {
    try {
      return await this.usersRepository.create(data);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(USER_MESSAGES.emailAlreadyRegistered);
      }
      throw error;
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
