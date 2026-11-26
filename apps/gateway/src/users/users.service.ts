import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { USER_PATTERNS, USER_SERVICE } from '@haydigo/contracts';
import type {
  FindUserByIdPayload,
  RegisterUserPayload,
  UserDto,
  VerifyCredentialsPayload,
} from '@haydigo/contracts';
import { sendRpc } from '../common/messaging/send-rpc';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_SERVICE) private readonly client: ClientProxy) {}

  register(payload: RegisterUserPayload): Promise<UserDto> {
    return sendRpc<UserDto, RegisterUserPayload>(
      this.client,
      USER_PATTERNS.register,
      payload,
    );
  }

  verifyCredentials(
    payload: VerifyCredentialsPayload,
  ): Promise<UserDto | null> {
    return sendRpc<UserDto | null, VerifyCredentialsPayload>(
      this.client,
      USER_PATTERNS.verifyCredentials,
      payload,
    );
  }

  findById(id: string): Promise<UserDto> {
    return sendRpc<UserDto, FindUserByIdPayload>(
      this.client,
      USER_PATTERNS.findById,
      { id },
    );
  }
}
