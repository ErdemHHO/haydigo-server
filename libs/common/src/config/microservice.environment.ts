import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class MicroserviceEnvironment {
  @IsString()
  @IsNotEmpty()
  NATS_URL: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @Transform(({ obj }: { obj: Record<string, unknown> }) =>
    [true, 'true'].includes(obj.DB_SYNCHRONIZE as boolean | string),
  )
  @IsBoolean()
  DB_SYNCHRONIZE: boolean = false;
}
