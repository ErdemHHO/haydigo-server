import type { UserDto } from '@haydigo/contracts';
import type { User } from '../entity/user.entity';

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt.toISOString(),
  };
}
