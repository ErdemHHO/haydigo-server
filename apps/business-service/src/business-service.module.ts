import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MicroserviceEnvironment,
  buildTypeOrmOptions,
  createEnvironmentValidator,
} from '@haydigo/common';
import { BusinessesModule } from './businesses/businesses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/business-service/.env'],
      validate: createEnvironmentValidator(MicroserviceEnvironment),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildTypeOrmOptions,
    }),
    BusinessesModule,
  ],
})
export class BusinessServiceModule {}
