import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { USER_LIMITS } from '@haydigo/contracts';
import type { VerifyCredentialsPayload } from '@haydigo/contracts';

export class LoginDto implements VerifyCredentialsPayload {
  @ApiProperty({ example: 'ada@example.com' })
  @IsEmail()
  @MaxLength(USER_LIMITS.emailMaxLength)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(USER_LIMITS.passwordMaxLength)
  password: string;
}
