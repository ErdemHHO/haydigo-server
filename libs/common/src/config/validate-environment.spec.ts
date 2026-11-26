import 'reflect-metadata';
import { MicroserviceEnvironment } from './microservice.environment';
import { createEnvironmentValidator } from './validate-environment';

describe('createEnvironmentValidator', () => {
  const validate = createEnvironmentValidator(MicroserviceEnvironment);

  it('reads DB_SYNCHRONIZE as a boolean', () => {
    const base = { NATS_URL: 'nats://localhost:4222', DATABASE_URL: 'pg://x' };

    expect(validate({ ...base, DB_SYNCHRONIZE: 'true' }).DB_SYNCHRONIZE).toBe(
      true,
    );
    expect(validate({ ...base, DB_SYNCHRONIZE: 'false' }).DB_SYNCHRONIZE).toBe(
      false,
    );
    expect(validate(base).DB_SYNCHRONIZE).toBe(false);
  });

  it('stops startup when a required variable is missing', () => {
    expect(() => validate({ NATS_URL: 'nats://localhost:4222' })).toThrow(
      /Invalid environment: .*DATABASE_URL/,
    );
  });
});
