import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import { RpcExceptionsFilter, natsMicroserviceOptions } from '@haydigo/common';
import { BUSINESS_SERVICE_QUEUE } from '@haydigo/contracts';
import { BusinessServiceModule } from './business-service.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    BusinessServiceModule,
    natsMicroserviceOptions(BUSINESS_SERVICE_QUEUE),
  );
  app.useGlobalFilters(new RpcExceptionsFilter());
  app.enableShutdownHooks();
  await app.listen();
}
void bootstrap();
