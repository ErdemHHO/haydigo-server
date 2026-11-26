import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponses,
  ApiStandardResponse,
} from '../common/decorators/api-standard-response.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/interfaces/authenticated-request.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@ApiErrorResponses(HttpStatus.UNAUTHORIZED)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Giriş yapmış kullanıcının bilgileri' })
  @ApiStandardResponse(UserResponseDto)
  findMe(@CurrentUser() user: AuthUser): Promise<UserResponseDto> {
    return this.usersService.findById(user.id);
  }
}
