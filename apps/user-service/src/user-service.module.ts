import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MicroserviceEnvironment,
  buildTypeOrmOptions,
  createEnvironmentValidator,
} from '@haydigo/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/user-service/.env'],
      validate: createEnvironmentValidator(MicroserviceEnvironment),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildTypeOrmOptions,
    }),
    UsersModule,
  ],
})
export class UserServiceModule {}
