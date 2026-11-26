import { ApiProperty } from '@nestjs/swagger';
import type { UserDto } from '@haydigo/contracts';

export class UserResponseDto implements UserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'ada@example.com' })
  email: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  fullName: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;
}
