import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import {
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
} from '../dto/api-response.dto';

interface ApiStandardResponseOptions {
  status?: HttpStatus;
  description?: string;
  isArray?: boolean;
}

export function ApiStandardResponse(
  model: Type<unknown>,
  {
    status = HttpStatus.OK,
    description,
    isArray = false,
  }: ApiStandardResponseOptions = {},
): MethodDecorator & ClassDecorator {
  const data = isArray
    ? { type: 'array', items: { $ref: getSchemaPath(model) } }
    : { $ref: getSchemaPath(model) };
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponseDto) },
          { properties: { data } },
        ],
      },
    }),
  );
}

export function ApiErrorResponses(
  ...statuses: HttpStatus[]
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ...statuses.map((status) =>
      ApiResponse({ status, type: ApiErrorResponseDto }),
    ),
  );
}
