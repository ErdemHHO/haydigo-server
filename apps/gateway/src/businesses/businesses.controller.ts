import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponses,
  ApiStandardResponse,
} from '../common/decorators/api-standard-response.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import type { AuthUser } from '../common/interfaces/authenticated-request.interface';
import { BusinessesService } from './businesses.service';
import { BUSINESS_RESPONSE_MESSAGES } from './constants/businesses.constants';
import {
  BusinessResponseDto,
  PaginatedBusinessesResponseDto,
} from './dto/business-response.dto';
import { CreateBusinessDto } from './dto/create-business.dto';
import { ListBusinessesQueryDto } from './dto/list-businesses-query.dto';

@ApiTags('businesses')
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Yayındaki işletmeler (şehir/kategori filtreli, sayfalı)',
  })
  @ApiStandardResponse(PaginatedBusinessesResponseDto)
  @ApiErrorResponses(HttpStatus.BAD_REQUEST)
  list(
    @Query() query: ListBusinessesQueryDto,
  ): Promise<PaginatedBusinessesResponseDto> {
    return this.businessesService.listPublished(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Yayındaki tek bir işletme' })
  @ApiStandardResponse(BusinessResponseDto)
  @ApiErrorResponses(HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BusinessResponseDto> {
    return this.businessesService.findPublishedById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Giriş yapmış kullanıcıya ait taslak işletme oluşturur',
  })
  @ResponseMessage(BUSINESS_RESPONSE_MESSAGES.created)
  @ApiStandardResponse(BusinessResponseDto, { status: HttpStatus.CREATED })
  @ApiErrorResponses(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED)
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateBusinessDto,
  ): Promise<BusinessResponseDto> {
    return this.businessesService.create(user.id, dto);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sahibi olunan işletmeyi yayınlar' })
  @ResponseMessage(BUSINESS_RESPONSE_MESSAGES.published)
  @ApiStandardResponse(BusinessResponseDto)
  @ApiErrorResponses(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  )
  publish(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BusinessResponseDto> {
    return this.businessesService.publish(id, user.id);
  }
}
