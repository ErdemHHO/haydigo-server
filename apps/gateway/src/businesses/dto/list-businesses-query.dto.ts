import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { BUSINESS_LIMITS } from '@haydigo/contracts';
import { IsSafeString } from '../../common/decorators/is-safe-string.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListBusinessesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'Istanbul' })
  @IsOptional()
  @IsString()
  @IsSafeString()
  @MaxLength(BUSINESS_LIMITS.cityMaxLength)
  city?: string;

  @ApiPropertyOptional({ example: 'cafe' })
  @IsOptional()
  @IsString()
  @IsSafeString()
  @MaxLength(BUSINESS_LIMITS.categoryMaxLength)
  category?: string;
}
