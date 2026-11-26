import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientsModule,
  ClientsProviderAsyncOptions,
  Transport,
} from '@nestjs/microservices';
import { BUSINESS_SERVICE, USER_SERVICE } from '@haydigo/contracts';
import type { GatewayEnvironment } from '../../config/gateway.environment';

function natsClient(name: string): ClientsProviderAsyncOptions {
  return {
    name,
    inject: [ConfigService],
    useFactory: (config: ConfigService<GatewayEnvironment, true>) => ({
      transport: Transport.NATS,
      options: { servers: [config.get('NATS_URL', { infer: true })] },
    }),
  };
}

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      natsClient(USER_SERVICE),
      natsClient(BUSINESS_SERVICE),
    ]),
  ],
  exports: [ClientsModule],
})
export class MessagingModule {}
