import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserDto } from '@haydigo/contracts';
import { UsersService } from '../users/users.service';
import { AUTH_MESSAGES } from './constants/auth.constants';
import type { AuthResponseDto } from './dto/auth-response.dto';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.usersService.register({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
    });
    return this.issueToken(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.verifyCredentials({
      email: dto.email,
      password: dto.password,
    });
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.invalidCredentials);
    }
    return this.issueToken(user);
  }

  private async issueToken(user: UserDto): Promise<AuthResponseDto> {
    const payload: JwtPayload = { sub: user.id };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
