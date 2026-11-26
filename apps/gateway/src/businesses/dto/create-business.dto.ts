import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { BUSINESS_LIMITS } from '@haydigo/contracts';
import { IsSafeString } from '../../common/decorators/is-safe-string.decorator';

export class CreateBusinessDto {
  @ApiProperty({ example: 'Kahve Durağı' })
  @IsString()
  @IsSafeString()
  @Length(BUSINESS_LIMITS.nameMinLength, BUSINESS_LIMITS.nameMaxLength)
  name: string;

  @ApiPropertyOptional({ example: 'Moda sahilinde üçüncü dalga kahveci' })
  @IsOptional()
  @IsString()
  @IsSafeString({ allowNewlines: true })
  @MaxLength(BUSINESS_LIMITS.descriptionMaxLength)
  description?: string;

  @ApiProperty({ example: 'cafe' })
  @IsString()
  @IsSafeString()
  @Length(BUSINESS_LIMITS.categoryMinLength, BUSINESS_LIMITS.categoryMaxLength)
  category: string;

  @ApiProperty({ example: 'Istanbul' })
  @IsString()
  @IsSafeString()
  @Length(BUSINESS_LIMITS.cityMinLength, BUSINESS_LIMITS.cityMaxLength)
  city: string;
}
