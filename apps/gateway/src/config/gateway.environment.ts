import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import {
  ENVIRONMENT_DEFAULTS,
  ENVIRONMENT_LIMITS,
} from '../common/constants/environment.constants';

export class GatewayEnvironment {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(ENVIRONMENT_LIMITS.maxPort)
  PORT: number = ENVIRONMENT_DEFAULTS.port;

  @IsString()
  @IsNotEmpty()
  NATS_URL: string;

  @IsString()
  @MinLength(ENVIRONMENT_LIMITS.jwtSecretMinLength)
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string = ENVIRONMENT_DEFAULTS.jwtExpiresIn;
}
