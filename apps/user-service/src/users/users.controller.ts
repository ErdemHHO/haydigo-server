import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERNS } from '@haydigo/contracts';
import type {
  FindUserByIdPayload,
  RegisterUserPayload,
  UserDto,
  VerifyCredentialsPayload,
} from '@haydigo/contracts';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USER_PATTERNS.register)
  register(@Payload() payload: RegisterUserPayload): Promise<UserDto> {
    return this.usersService.register(payload);
  }

  @MessagePattern(USER_PATTERNS.verifyCredentials)
  verifyCredentials(
    @Payload() payload: VerifyCredentialsPayload,
  ): Promise<UserDto | null> {
    return this.usersService.verifyCredentials(payload);
  }

  @MessagePattern(USER_PATTERNS.findById)
  findById(@Payload() payload: FindUserByIdPayload): Promise<UserDto> {
    return this.usersService.findById(payload.id);
  }
}
