import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MicroserviceEnvironment } from '../config/microservice.environment';

export function buildTypeOrmOptions(
  config: ConfigService<MicroserviceEnvironment, true>,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: config.get('DATABASE_URL', { infer: true }),
    autoLoadEntities: true,
    synchronize: config.get('DB_SYNCHRONIZE', { infer: true }),
  };
}
