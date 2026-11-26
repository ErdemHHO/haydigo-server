import { ApiProperty } from '@nestjs/swagger';
import { BusinessStatus } from '@haydigo/contracts';
import type { BusinessDto, Paginated } from '@haydigo/contracts';

export class BusinessResponseDto implements BusinessDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  ownerUserId: string;

  @ApiProperty({ example: 'Kahve Durağı' })
  name: string;

  @ApiProperty({ type: String, nullable: true })
  description: string | null;

  @ApiProperty({ example: 'cafe' })
  category: string;

  @ApiProperty({ example: 'Istanbul' })
  city: string;

  @ApiProperty({ enum: BusinessStatus, enumName: 'BusinessStatus' })
  status: BusinessStatus;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  publishedAt: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;
}

export class PaginatedBusinessesResponseDto implements Paginated<BusinessResponseDto> {
  @ApiProperty({ type: [BusinessResponseDto] })
  items: BusinessResponseDto[];

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;
}
