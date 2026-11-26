import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';
import { USER_LIMITS } from '@haydigo/contracts';
import type { RegisterUserPayload } from '@haydigo/contracts';
import { IsSafeString } from '../../common/decorators/is-safe-string.decorator';

export class RegisterDto implements RegisterUserPayload {
  @ApiProperty({ example: 'ada@example.com' })
  @IsEmail()
  @MaxLength(USER_LIMITS.emailMaxLength)
  email: string;

  @ApiProperty({
    minLength: USER_LIMITS.passwordMinLength,
    maxLength: USER_LIMITS.passwordMaxLength,
  })
  @IsString()
  @Length(USER_LIMITS.passwordMinLength, USER_LIMITS.passwordMaxLength)
  password: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  @IsString()
  @IsSafeString()
  @Length(USER_LIMITS.fullNameMinLength, USER_LIMITS.fullNameMaxLength)
  fullName: string;
}
