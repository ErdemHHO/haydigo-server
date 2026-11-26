import { ConfigService } from '@nestjs/config';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { MicroserviceEnvironment } from '../config/microservice.environment';

export function natsMicroserviceOptions(
  queue: string,
): AsyncMicroserviceOptions {
  return {
    inject: [ConfigService],
    useFactory: (config: ConfigService<MicroserviceEnvironment, true>) => ({
      transport: Transport.NATS,
      options: {
        servers: [config.get('NATS_URL', { infer: true })],
        queue,
      },
    }),
  };
}
