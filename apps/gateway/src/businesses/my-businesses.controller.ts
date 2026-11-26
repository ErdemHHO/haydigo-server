import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponses,
  ApiStandardResponse,
} from '../common/decorators/api-standard-response.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/interfaces/authenticated-request.interface';
import { BusinessesService } from './businesses.service';
import { BusinessResponseDto } from './dto/business-response.dto';

@ApiTags('businesses')
@ApiBearerAuth()
@ApiErrorResponses(HttpStatus.UNAUTHORIZED)
@Controller('users/me/businesses')
export class MyBusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get()
  @ApiOperation({
    summary: 'Giriş yapmış kullanıcının işletmeleri (taslaklar dahil)',
  })
  @ApiStandardResponse(BusinessResponseDto, { isArray: true })
  list(@CurrentUser() user: AuthUser): Promise<BusinessResponseDto[]> {
    return this.businessesService.listByOwner(user.id);
  }
}
