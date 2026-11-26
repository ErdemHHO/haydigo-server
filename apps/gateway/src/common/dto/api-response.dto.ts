import { ApiProperty } from '@nestjs/swagger';
import type { ApiErrorResponse } from '../interfaces/api-response.interface';

export class ApiSuccessResponseDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: 'İşlem başarılı' })
  message: string;
}

export class ApiErrorResponseDto implements ApiErrorResponse {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ example: 'Gönderilen veriler geçersiz' })
  message: string;

  @ApiProperty({ type: [String], example: ['email must be an email'] })
  errors: string[];

  @ApiProperty({ example: 400 })
  statusCode: number;
}
